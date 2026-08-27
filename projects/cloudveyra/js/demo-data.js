// Static sample data for the CloudVeyra browser demo.
// No credentials, APIs, or backend services are used by this dataset.

window.cloudVeyraDemo = {
  project: {
    name: 'Jarvis AI Platform',
    environment: 'Production',
    regionCount: 2,
    subscriptionCount: 2,
    resources: [
      {
        id: 'aks-jarvis-prod',
        name: 'aks-jarvis-prod',
        type: 'Azure Kubernetes Service',
        icon: 'cluster',
        category: 'compute',
        region: 'East US 2',
        sku: '12 nodes · v1.29.2',
        status: 'Healthy',
        latency: 42,
        metricLabel: 'CPU utilization',
        metricValue: '61%',
        metricTrend: '-8.4%',
        points: [38, 41, 37, 48, 44, 53, 49, 61],
        description: 'Production Kubernetes cluster running the Jarvis inference and orchestration workloads.',
        tags: ['Project: JarvisAI', 'Tier: Platform', 'Managed']
      },
      {
        id: 'app-jarvis-api',
        name: 'app-jarvis-api',
        type: 'Azure Container App',
        icon: 'container',
        category: 'compute',
        region: 'East US 2',
        sku: '2 vCPU · 4 GiB',
        status: 'Healthy',
        latency: 28,
        metricLabel: 'Requests / min',
        metricValue: '18.4k',
        metricTrend: '+12.1%',
        points: [24, 29, 27, 39, 36, 48, 45, 58],
        description: 'Autoscaling API surface for job orchestration, profile retrieval, and workflow events.',
        tags: ['Project: JarvisAI', 'Tier: API', 'Autoscale']
      },
      {
        id: 'kv-jarvis-secrets',
        name: 'kv-jarvis-secrets',
        type: 'Azure Key Vault',
        icon: 'shield',
        category: 'security',
        region: 'East US 2',
        sku: 'Standard HSM · TLS 1.3',
        status: 'Healthy',
        latency: null,
        metricLabel: 'Secret rotations',
        metricValue: '24 / 24',
        metricTrend: 'On schedule',
        points: [40, 40, 43, 43, 46, 46, 51, 51],
        description: 'Managed secrets, certificates, and service credentials with automated rotation policies.',
        tags: ['Project: JarvisAI', 'Tier: Security', 'HSM']
      },
      {
        id: 'cosmos-jarvis-vectors',
        name: 'cosmos-jarvis-vectors',
        type: 'Azure Cosmos DB',
        icon: 'database',
        category: 'data',
        region: 'Central US',
        sku: 'Autoscale · 12k RU/s',
        status: 'Healthy',
        latency: 19,
        metricLabel: 'RU consumption',
        metricValue: '47%',
        metricTrend: '-3.2%',
        points: [54, 49, 52, 44, 48, 43, 46, 41],
        description: 'Globally distributed vector and operational data store for retrieval workflows.',
        tags: ['Project: JarvisAI', 'Tier: Data', 'Geo-replicated']
      }
    ],
    activity: [
      { time: '2 min ago', title: 'Deployment completed', detail: 'app-jarvis-api revision 48 promoted to production.', tone: 'success' },
      { time: '18 min ago', title: 'Autoscale policy evaluated', detail: 'AKS node pool remained at 12 nodes after load analysis.', tone: 'info' },
      { time: '1 hr ago', title: 'Certificate rotation verified', detail: 'kv-jarvis-secrets completed the scheduled certificate check.', tone: 'success' },
      { time: '3 hrs ago', title: 'Performance insight', detail: 'Cosmos DB request units decreased 3.2% over the previous window.', tone: 'neutral' }
    ]
  }
};
