export default {
  name: 'collection',
  title: 'Photo Collection',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Collection Name',
      type: 'string',
      validation: Rule => Rule.required().max(100)
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.max(500)
    },
    {
      name: 'photos',
      title: 'Photos',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'photo'}]
        }
      ],
      description: 'Select photos to include in this collection'
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      description: 'URL-friendly version of the collection name'
    }
  ],
  preview: {
    select: {
      title: 'name',
      photos: 'photos'
    },
    prepare(selection) {
      const {title, photos} = selection
      const photoCount = photos ? photos.length : 0
      return {
        title: title,
        subtitle: `${photoCount} photo${photoCount !== 1 ? 's' : ''}`
      }
    }
  }
}