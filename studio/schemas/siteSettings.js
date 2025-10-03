export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  __experimental_actions: [/*'create',*/ 'update', /*'delete',*/ 'publish'],
  fields: [
    {
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      description: 'The name of the website (e.g., "Joel Photography")',
      validation: Rule => Rule.required()
    },
    {
      name: 'siteUrl',
      title: 'Site URL',
      type: 'url',
      description: 'The main URL of your website',
      validation: Rule => Rule.required()
    },
    {
      name: 'defaultSeoTitle',
      title: 'Default SEO Title',
      type: 'string',
      description: 'Default title for search engines and social media',
      validation: Rule => Rule.required().max(60)
    },
    {
      name: 'defaultSeoDescription',
      title: 'Default SEO Description',
      type: 'text',
      description: 'Default description for search engines and social media',
      validation: Rule => Rule.required().max(160)
    },
    {
      name: 'keywords',
      title: 'SEO Keywords',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Keywords for search engine optimization',
      options: {
        layout: 'tags'
      }
    },
    {
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
      description: 'The photographer\'s name',
      validation: Rule => Rule.required()
    },
    {
      name: 'authorJobTitle',
      title: 'Author Job Title',
      type: 'string',
      description: 'Professional title (e.g., "Professional Wildlife Photographer")',
      validation: Rule => Rule.required()
    },
    {
      name: 'authorLocation',
      title: 'Author Location',
      type: 'string',
      description: 'Where the photographer is based (e.g., "Colorado, USA")',
      validation: Rule => Rule.required()
    },
    {
      name: 'twitterHandle',
      title: 'Twitter Handle',
      type: 'string',
      description: 'Twitter username without @ symbol',
      validation: Rule => Rule.regex(/^[A-Za-z0-9_]+$/, {
        name: 'Twitter handle',
        invert: false
      })
    },
    {
      name: 'socialMediaLinks',
      title: 'Social Media Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'Twitter', value: 'twitter'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'YouTube', value: 'youtube'}
                ]
              }
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url'
            }
          ]
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'siteName',
      subtitle: 'siteUrl'
    }
  }
}