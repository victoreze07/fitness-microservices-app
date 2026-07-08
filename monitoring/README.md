# Monitoring

This project uses the `kube-prometheus-stack` Helm chart through Argo CD to install Prometheus, Grafana, Alertmanager, kube-state-metrics, and node-exporter.

## Install

Apply the Argo CD project first, then the application:

```powershell
kubectl apply -f argocd/monitoring-project.yaml
kubectl apply -f argocd/monitoring-application.yaml
```

Check the deployment:

```powershell
kubectl get pods -n monitoring
kubectl get applications -n argocd
```

## Open Grafana

Port-forward Grafana:

```powershell
kubectl port-forward svc/kube-prometheus-stack-grafana -n monitoring 3001:80
```

Open:

```text
http://localhost:3001
```

The default username is:

```text
admin
```

Get the generated password:

```powershell
kubectl get secret kube-prometheus-stack-grafana -n monitoring -o jsonpath="{.data.admin-password}"
```

Decode the value:

```powershell
[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("<paste-password-value-here>"))
```

## Open Prometheus

```powershell
kubectl port-forward svc/kube-prometheus-stack-prometheus -n monitoring 9090:9090
```

Open:

```text
http://localhost:9090
```

## Notes

This monitors Kubernetes and cluster-level metrics immediately. To monitor application-level metrics, add `/metrics` endpoints to the Node.js services and create `ServiceMonitor` resources for the `fitness` namespace.
