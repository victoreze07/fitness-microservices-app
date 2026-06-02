locals {
  common_tags = merge(
    {
      Project   = var.project_name
      ManagedBy = "terraform"
      Role      = "jenkins"
    },
    var.tags
  )
}
