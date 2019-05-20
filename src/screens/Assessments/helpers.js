import { sumBy, map, filter } from 'lodash'

export const populateAssessmentDomains = (assessment, domains, client) => {
  const assessmentDomains = assessment ? assessment.assessment_domain : []
  if (assessmentDomains.length > 0)
    return addDomainsToAssessment(assessmentDomains, domains)

  const incomplete_tasks = [...client.tasks.overdue, ...client.tasks.today, ...client.tasks.upcoming]

  return domains.map(domain => ({
    id: domain.id,
    goal: '',
    score: null,
    reason: '',
    domain: domain,
    domain_id: domain.id,
    attachments: [],
    goal_required: true,
    required_task_last: false,
    incomplete_tasks: incomplete_tasks.filter((task) => task.domain.id == domain.id)
  }))
}

export const addDomainsToAssessment = (assessmentDomains, domains) => (
  assessmentDomains.map(ad => {
    const domain = domains.find(d => d.id === ad.domain_id)
    return { ...ad, domain }
  })
)

export const calculateAttachmentsSize = (assessment) => {
  if (!assessment) return

  const size = assessment.assessment_domain.reduce((sum, ad) => {
    const attachments = ad.attachments.filter(attachment => attachment.size !== undefined)
    sum += sumBy(attachments, 'size')
    return sum
  }, 0)

  return size
}

export const incompletedDomainIds = (assessment) => (
  map(filter(assessment.assessment_domain, ad => ad.required_task_last), 'domain_id')
)