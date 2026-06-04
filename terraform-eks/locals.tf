locals {
  cluster_name = var.cluster_name != "" ? var.cluster_name : "${var.project_name}-eks"

  cluster_admin_principal_arns = distinct(compact(concat(
    [var.cluster_admin_principal_arn != "" ? var.cluster_admin_principal_arn : data.aws_caller_identity.current.arn],
    var.cluster_admin_principal_arns
  )))

  common_tags = merge(
    {
      Project   = var.project_name
      ManagedBy = "terraform"
    },
    var.tags
  )
}
