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
          .title('Content Management')
          .items([
            // Site Configuration
            S.listItem()
              .title('🔧 Site Configuration')
              .child(
                S.list()
                  .title('Site Configuration')
                  .items([
                    S.listItem()
                      .title('Site Settings')
                      .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
                    S.listItem()
                      .title('Navigation')
                      .child(S.document().schemaType('navigation').documentId('navigation')),
                    S.listItem()
                      .title('Footer')
                      .child(S.document().schemaType('footer').documentId('footer')),
                  ])
              ),

            // Page Content
            S.listItem()
              .title('📄 Page Content')
              .child(
                S.list()
                  .title('Page Content')
                  .items([
                    S.listItem()
                      .title('Home Page')
                      .child(S.document().schemaType('homePage').documentId('homePage')),
                    S.listItem()
                      .title('Explore Page')
                      .child(S.document().schemaType('explorePage').documentId('explorePage')),
                  ])
              ),

            S.divider(),

            // Photography Content
            S.listItem()
              .title('📸 Photography')
              .child(
                S.list()
                  .title('Photography Content')
                  .items([
                    S.listItem()
                      .title('All Photos')
                      .child(
                        S.documentTypeList('photo')
                          .title('All Photos')
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
                      .title('Photo Collections')
                      .child(
                        S.documentTypeList('collection')
                          .title('Photo Collections')
                      ),
                  ])
              ),
          ])
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})