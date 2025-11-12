
export default ({ env }) => {

    return {
        upload: {
          config: {
            provider: 'aws-s3',
            providerOptions: {
              s3Options: {
                accessKeyId: env('STRAPI_AWS_ACCESS_KEY_ID'),
                secretAccessKey: env('STRAPI_AWS_ACCESS_SECRET'),
                region: env('STRAPI_AWS_REGION'),
                params: {
                  ACL: env('STRAPI_AWS_ACL', 'public-read'),
                  signedUrlExpires: env('STRAPI_AWS_SIGNED_URL_EXPIRES', 15 * 60),
                  Bucket: env('STRAPI_AWS_BUCKET'),
                },
              },
            },
            actionOptions: {
              upload: {},
              uploadStream: {},
              delete: {},
            },
          },
        },
        "users-permissions": {
          config: {
            register: {
              allowedFields: ["organization", "jwt_token"],
            },
            jwt: {
              expiresIn: '1y',
            },
            ratelimit: {
              interval: 60000,
              max: 100000,
            },
          },
        },
    
        reports: {
          enabled: true,
          resolve: './src/plugins/reports',
        },
      };

};
