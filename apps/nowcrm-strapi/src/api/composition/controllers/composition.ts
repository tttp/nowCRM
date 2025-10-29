/**
 * composition controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::composition.composition', ({ strapi }) => ({

  async duplicate(ctx) {
    const { documentId } = ctx.request.body;
    const user = ctx.state.user;

    if (!documentId) return ctx.badRequest("Missing composition id");
    if (!user) return ctx.unauthorized("User not authenticated");
    try {
      // 🔍 Fetch the original composition and its items (with channels)
      const original = await strapi.documents('api::composition.composition').findOne( {
        documentId,
        populate: {
          composition_items: {
            populate: ['channel'],
          },
        },
      });

      if (!original) return ctx.notFound("Composition not found");

      // 🧼 Destructure and clean base composition
      const {
        id: _,
        documentId: _DocumentId,
        createdAt,
        updatedAt,
        publishedAt,
        composition_items,
        ...baseData
      } = original;

      const duplicateData = {
        ...baseData,
        name: `${original.name} (Copy)`,
        publishedAt: new Date().toISOString(),
      };

      // 🆕 Create the new composition
      const newComposition = await strapi.documents('api::composition.composition').create({
        data: duplicateData,
      });

      // 🔁 Duplicate each item and attach to new composition
      for (const item of composition_items || []) {
        const {
          id: _itemId,
          documentId: _itemDocumentId,
          channel: _channel,
          createdAt,
          updatedAt,
          publishedAt,
          composition,
          ...itemData
        } = item;
        // Create new item with fresh publication and reference to new composition
        await strapi.documents('api::composition-item.composition-item').create({
          data: {
            ...itemData,
            channel: _channel.documentId,
            composition: newComposition.documentId,
            publishedAt: new Date().toISOString(),
          },
        });
      }

      return ctx.send({
        success: true,
        data: newComposition,
      });

    } catch (err) {
      console.error('❌ Duplicate composition error:', err);
      return ctx.send({
        success: false,
        message: 'Failed to duplicate composition',
        error: err?.message || 'Unknown error',
      }, 500);
    }
  },
}));
