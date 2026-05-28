locals {
  cluster_name = var.cluster_name != "" ? var.cluster_name : "${var.project_name}-eks"

  common_tags = merge(
    {
      Project   = var.project_name
      ManagedBy = "terraform"
    },
    var.tags
  )
}
