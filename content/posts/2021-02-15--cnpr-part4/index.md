---
title: Cloud Native Production Readiness Part 4
subTitle: Monitoring & Documentation
cover: whatever.jpg
category: "cloud-native"
---

Its key metrics are identified and monitored at the host, infrastructure, and microservice levels.

It has appropriate logging that accurately reflects the past states of the microservice.

Its dashboards are easy to interpret and contain all key metrics.

Its alerts are actionable and are defined by signal-providing thresholds.

There is a dedicated on-call rotation responsible for monitoring and responding to any incidents and outages.

There is a clear, well-defined, and standardized on-call procedure in place for handling incidents and outages.

It has comprehensive documentation.

Its documentation is updated regularly.

Its documentation contains a description of the microservice; an architecture diagram; contact and on-call information; links to important information; an onboarding and development guide; information about the service’s request flow(s), endpoints, and dependencies; an on-call runbook; and answers to frequently asked questions.

It is well understood at the developer, team, and organizational levels.

It is held to a set of production-readiness standards and meets the associated requirements.

Its architecture is reviewed and audited frequently.


Monitoring
Key Metrics
What are this microservice’s key metrics?

What are the host and infrastructure metrics?

What are the microservice-level metrics?

Are all the microservice’s key metrics monitored?

Logging
What information does this microservice need to log?

Does this microservice log all important requests?

Does the logging accurately reflect the state of the microservice at any given time?

Is this logging solution cost-effective and scalable?

Dashboards
Does this microservice have a dashboard?

Is the dashboard easy to interpret? Are all key metrics displayed on the dashboard?

Can I determine whether or not this microservice is working correctly by looking at the dashboard?

Alerting
Is there an alert for every key metric?

Are all alerts defined by good, signal-providing thresholds?

Are alert thresholds set appropriately so that alerts will fire before an outage occurs?

Are all alerts actionable?

Are there step-by-step triage, mitigation, and resolution instructions for each alert in the on-call runbook?

On-Call Rotations
Is there a dedicated on-call rotation responsible for monitoring this microservice?

Is there a minimum of two developers on each on-call shift?

Are there standardized on-call procedures across the engineering organization?

Documentation and Understanding
Microservice Documentation
Is the documentation for all microservices stored in a centralized, shared, and easily accessible place?

Is the documentation easily searchable?

Are significant changes to the microservice accompanied by updates to the microservice’s documentation?

Does the microservice’s documentation contain a description of the microservice?

Does the microservice’s documentation contain an architecture diagram?

Does the microservice’s documentation contain contact and on-call information?

Does the microservice’s documentation contain links to important information?

Does the microservice’s documentation contain an onboarding and development guide?

Does the microservice’s documentation contain information about the microservice’s request flow, endpoints, and dependencies?

Does the microservice’s documentation contain an on-call runbook?

Does the microservice’s documentation contain an FAQ section?

Microservice Understanding
Can every developer on the team answer questions about the production-readiness of the microservice?

Is there a set of principles and standards that all microservices are held to?

Is there an RFC process in place for every new microservice?

Are existing microservices reviewed and audited frequently?

Are architecture reviews held for every microservice team?

Is there a production-readiness audit process in place?

Are production-readiness roadmaps used to bring the microservice to a production-ready state?

Do the production-readiness standards drive the organization’s OKRs?

Is the production-readiness process automated?