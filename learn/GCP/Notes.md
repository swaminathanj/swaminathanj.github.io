Aum Amma

Coursera: 

## Exploring and Preparing your Data with BigQuery

### Challenges faced by Data Analysis
- Querying: Queries take too long
- Querying: No easy way to combine and query all data collected
- Infrastructure: Maintaining and upgrading servers unsustainable
- Infrastructure: Clusters not scaling well
- Storage: Can store only a subset of data the business generates
- Storage: Don't have <b>central data</b> analytics warehouse or set of tools

A walk-through Query to BigQuery - Query took 6 seconds to process 4.35 GB of New York taxi data from 2015 till date.

### Compare Big Data on Premise vs. Cloud
Why GCP is used for data analysis?
- Storage is cheap
- Focus on queries, not infrastructure
- Massive scalability

Traditional big data platform require an investment in infrastructure.
- Processors, storage, networking, administrators/technicians
- Under-provisioned (demand > capacity, 120s - 1 machine) or over-provisioned (demand < capacity, 1s - 120 machines)
- Storage and processing on same servers

Typical big data processing includes
- Resource provisioning
- Handling growing scale
- Reliability
- Deployment and configuration
- Utilization improvements
- Performance tuning
- Monitoring
- Insights (main goal)

Google had to deal with all these challenges since it processes huge volumes of data. Now, they have made available GCP. With GCP, you focus only on <b>insights</b>. So, the cloud will run on Google infrastructure. <b>True on-demand cloud!</b>. Pay only for queries you process or store (i.e. data you use). 

### Real world use cases

1. Ocado - large online grocer in UK, store peta bytes of data, their mission is to make their data so intelligent that it has answer to queries before being asked.
2. Spotify - Music streaming service

### Navigate Google Cloud Platform Project Basics
- Dashboard (projects, resources, billing)
- Projects organize all your activities
- Resources are what you use in the cloud (Buckets for storage, BigQuery Datasets)
- Billed for the resources you use (buckets, query and table storage)


