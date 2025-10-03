import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Joel Wildlife Photography',

  projectId: 'dvhf52ob', // Replace with your project ID
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Photos')
              .child(
                S.documentTypeList('photo')
                  .title('Photos')
                  .defaultOrdering([{field: 'dateTaken', direction: 'desc'}])
              ),
            S.listItem()
              .title('Featured Photos')
              .child(
                S.documentTypeList('photo')
                  .title('Featured Photos')
                  .filter('featured == true')
                  .defaultOrdering([{field: 'dateTaken', direction: 'desc'}])
              ),
            S.listItem()
              .title('Collections')
              .child(
                S.documentTypeList('collection')
                  .title('Photo Collections')
              ),
          ])
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})