import * as migration_20260627_195924_initial_schema from './20260627_195924_initial_schema'
import * as migration_20260628_163059_posts_autosave from './20260628_163059_posts_autosave'

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
]
