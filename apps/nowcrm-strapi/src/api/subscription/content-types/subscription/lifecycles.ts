import { v4 as uuidv4 } from 'uuid';

export default {

	 async beforeCreate(event) {
        const { data, where, select, populate } = event.params;
		data.subscribed_at = new Date().getTime()
        data.unsubscribe_token = uuidv4();

        if(!data.consent || !data.consent.connect.length) {
            const consent = await strapi.db.query('api::consent.consent').findOne({
                select: ['id', 'version'],
                where: { active: true },
                orderBy: { updatedAt: 'DESC' }
            });
            if(consent) {
                data.consent = {connect: [consent.id] };
            }
        }

        if(!data.subscription_type || !data.subscription_type?.connect?.length){
            const type = await strapi.db.query('api::subscription-type.subscription-type').findOne({
                select: ['id'],
                orderBy: { id: 'ASC' }
            });
            if(type) {
                data.subscription_type = { connect: [type.id] };
            }
        }
	},

}
