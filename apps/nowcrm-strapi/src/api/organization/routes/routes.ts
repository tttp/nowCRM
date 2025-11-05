export default {
  routes: [
    // Duplicate a organization
    {
      method: 'POST',
      path: '/organization/duplicate',
      handler: 'organization.duplicate',
    },
  ],
};
