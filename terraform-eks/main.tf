module "network" {
  source = "./modules/network"

  project_name        = var.project_name
  cluster_name        = local.cluster_name
  vpc_cidr            = var.vpc_cidr
  public_subnet_cidrs = var.public_subnet_cidrs
  tags                = local.common_tags
}

module "eks" {
  source = "./modules/eks"

  project_name                    = var.project_name
  cluster_name                    = local.cluster_name
  cluster_version                 = var.cluster_version
  cluster_admin_principal_arns    = local.cluster_admin_principal_arns
  cluster_admin_access_policy_arn = var.cluster_admin_access_policy_arn
  public_subnet_ids               = module.network.public_subnet_ids
  node_instance_types             = var.node_instance_types
  node_desired_size               = var.node_desired_size
  node_min_size                   = var.node_min_size
  node_max_size                   = var.node_max_size
  node_disk_size                  = var.node_disk_size
  tags                            = local.common_tags
}

module "argocd" {
  count = var.install_argocd ? 1 : 0

  source = "./modules/argocd"

  namespace     = var.argocd_namespace
  chart_version = var.argocd_chart_version

  depends_on = [
    module.eks
  ]
}
