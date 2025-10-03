export default {
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  __experimental_actions: [/*'create',*/ 'update', /*'delete',*/ 'publish'],
  fields: [
    {
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      description: 'The brand name shown in the navigation (e.g., "Joel Photography")',
      validation: Rule => Rule.required()
    },
    {
      name: 'menuItems',
      title: 'Menu Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Menu Item Name',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'href',
              title: 'Link',
              type: 'string',
              description: 'Internal link (e.g., "/", "/explore") or external URL',
              validation: Rule => Rule.required()
            },
            {
              name: 'order',
              title: 'Order',
              type: 'number',
              description: 'Order in which this item appears in the menu',
              validation: Rule => Rule.required().integer().min(0)
            }
          ]
        }
      ],
      validation: Rule => Rule.max(10)
    },
    {
      name: 'mobileMenuToggleLabel',
      title: 'Mobile Menu Toggle Label',
      type: 'string',
      description: 'Accessibility label for mobile menu toggle button',
      initialValue: 'Toggle mobile menu'
    }
  ],
  preview: {
    select: {
      title: 'brandName',
      menuItems: 'menuItems'
    },
    prepare(selection) {
      const {title, menuItems} = selection
      const itemCount = menuItems ? menuItems.length : 0
      return {
        title: title,
        subtitle: `${itemCount} menu item${itemCount !== 1 ? 's' : ''}`
      }
    }
  }
}