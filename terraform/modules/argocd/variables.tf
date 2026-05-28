variable "namespace" {
  description = "Namespace where Argo CD will be installed."
  type        = string
}

variable "chart_version" {
  description = "Argo CD Helm chart version."
  type        = string
}
