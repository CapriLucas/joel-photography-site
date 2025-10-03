export default {
  name: 'footer',
  title: 'Footer',
  type: 'document',
  __experimental_actions: [/*'create',*/ 'update', /*'delete',*/ 'publish'],
  fields: [
    // Brand Section
    {
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      description: 'Brand name shown in footer',
      validation: Rule => Rule.required()
    },
    {
      name: 'brandDescription',
      title: 'Brand Description',
      type: 'text',
      description: 'Short description about the business',
      validation: Rule => Rule.required()
    },

    // Contact Section
    {
      name: 'contactSectionTitle',
      title: 'Contact Section Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Physical location or base (e.g., "Based in Colorado, USA")',
      validation: Rule => Rule.required()
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      description: 'Optional phone number'
    },

    // Quick Links Section
    {
      name: 'quickLinksSectionTitle',
      title: 'Quick Links Section Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'quickLinks',
      title: 'Quick Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Link Name',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'href',
              title: 'Link URL',
              type: 'string',
              description: 'Internal link (e.g., "/", "/explore") or external URL',
              validation: Rule => Rule.required()
            },
            {
              name: 'order',
              title: 'Order',
              type: 'number',
              description: 'Order in which this link appears',
              validation: Rule => Rule.required().integer().min(0)
            }
          ]
        }
      ]
    },

    // Additional Sections (optional)
    {
      name: 'additionalSections',
      title: 'Additional Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Section Title',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'name',
                      title: 'Link Name',
                      type: 'string',
                      validation: Rule => Rule.required()
                    },
                    {
                      name: 'href',
                      title: 'Link URL',
                      type: 'string',
                      validation: Rule => Rule.required()
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },

    // Copyright Section
    {
      name: 'copyrightText',
      title: 'Copyright Text',
      type: 'string',
      description: 'Copyright text (year will be added automatically)',
      validation: Rule => Rule.required()
    },
    {
      name: 'tagline',
      title: 'Footer Tagline',
      type: 'string',
      description: 'Additional tagline or credits text',
      validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      title: 'brandName',
      subtitle: 'brandDescription'
    }
  }
}