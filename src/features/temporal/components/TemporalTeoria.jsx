import { ModuleTeoria } from '@/components/shared/ModuleTeoria.jsx'
import { moduleContent } from '../content.js'

export function TemporalTeoria({ onSectionRead }) {
  return <ModuleTeoria sections={moduleContent.sections} onSectionRead={onSectionRead} />
}
