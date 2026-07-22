import * as migration_20260627_195924_initial_schema from './20260627_195924_initial_schema'
import * as migration_20260628_163059_posts_autosave from './20260628_163059_posts_autosave'
import * as migration_20260702_194345_legal_section from './20260702_194345_legal_section'
import * as migration_20260720_120000_tenant_scope_media_forms from './20260720_120000_tenant_scope_media_forms'
import * as migration_20260721_120000_signup_notify_emails from './20260721_120000_signup_notify_emails'
import * as migration_20260721_130000_story_timeline_block from './20260721_130000_story_timeline_block'

export const migrations = [
  {
    up: migration_20260627_195924_initial_schema.up,
    down: migration_20260627_195924_initial_schema.down,
    name: '20260627_195924_initial_schema',
  },
  {
    up: migration_20260628_163059_posts_autosave.up,
    down: migration_20260628_163059_posts_autosave.down,
    name: '20260628_163059_posts_autosave',
  },
  {
    up: migration_20260702_194345_legal_section.up,
    down: migration_20260702_194345_legal_section.down,
    name: '20260702_194345_legal_section',
  },
  {
    up: migration_20260720_120000_tenant_scope_media_forms.up,
    down: migration_20260720_120000_tenant_scope_media_forms.down,
    name: '20260720_120000_tenant_scope_media_forms',
  },
  {
    up: migration_20260721_120000_signup_notify_emails.up,
    down: migration_20260721_120000_signup_notify_emails.down,
    name: '20260721_120000_signup_notify_emails',
  },
  {
    up: migration_20260721_130000_story_timeline_block.up,
    down: migration_20260721_130000_story_timeline_block.down,
    name: '20260721_130000_story_timeline_block',
  },
]
