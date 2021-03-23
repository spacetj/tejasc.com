---
title: Stability and Reliability
subTitle: Cloud Native Production Readiness Part 1
cover: whatever.jpg
category: "cloud-native"
publish: "true"
---

What does it mean for an application to be production ready? Thankfully industry leaders a lot smarter than me have given this a lot of thought!

If you havn't come across these resources yet, I would definitely recommend going through them before reading this post:

- 📹 [Building Production Ready Application][production-ready-talk] by Michael Kehoe
- 📕 [Production-Ready Microservices][production-readiness-book] by Susan J. Fowler

There are 8 main tenets of production readiness that are highlighted in these resources:

- 🔗 Stability
- 🎯 Reliability
- 🥁 Performance
- 📈 Scalability
- ✂️ Fault Tolerance
- 💥 Disaster Recovery
- 🔍 Monitoring
- 📕 Documentation

As technology evolves, there are several tools that help achieve each of these tenets of production readiness mentioned by Susan J. Fowler. In this series of blog posts, I'll be exploring the different cloud native tools which helps implement these principles. My goal for this series is to introduce you to atleast 1 new tools which you might not have come across before.

The tools mentioned in this blog are just examples of tools available, and might not be the best suited for your usecase. Hopefully this will give you a starting point so you can research the tools that is most appropriate for your ecosystem.

### Assumptions

In these series of posts, I'll be exploring application that are:

- Running in kubernetes
- Exploring tools that are Cloud Native mostly from [CNCF Landscape][cncf-landspace]

## Principles

Stability and Realiability is the first 2 production readiness principles mentioned in the book.

> Stability: Development, deployment, adoption of new technologies, and the decommissioning or deprecation of other services do not give rise to instability across the larger microservice ecosystem.

> Reliability: One that can be trusted by other microservices and by the overall system.


### Local Testing

#### KIND

<img align="left" style="width:100px; height:60px;" src="./assets/kind.png" />

Some text about the kind will go here. But when this is viewed in the browser, it'll be turned into a full width image.

#### Skaffold

#### Tilt

### Build and Packaging

#### Image Building

#### Manifest Packaging



### Stability

Stability means ensuring that there is a stable development and deployment environment. This involves having a repeatable and realiable Continuous Deployment Process.

- Local Testing:
  - Kind
  - Skaffold vs Tilt
  - Functions Framework
- Building and packaging
  - Docker
  - containerd
  - CoreOS rkt
  - Podman
  - ko
  - runC
  - buildpacks: Cloud Native Buildpacks embrace modern container standards, such as the OCI image format. They take advantage of the latest capabilities of these standards, such as cross-repository blob mounting and image layer "rebasing" on Docker API v2 registries.
  - Manifest packaging:
    - helm:
    - https://tanka.dev/
- CD
  - Spinnaker
  - Flagger: https://docs.flagger.app/
  - Client Side: https://werf.io/introduction.html
  - Flux: Gitops: https://docs.fluxcd.io/en/latest/
  - Keptn: https://keptn.sh/
    - Keptn + Argo: https://tutorials.keptn.sh/tutorials/keptn-argo-cd-deployment-07/index.html?index=..%2F..index#9
  - ArgoCD:
  - https://github.com/hyscale/hyscale: Abstraction layer on top of kubernetes
- Debugging
  - https://github.com/vmware-tanzu/octant
  - Debugging: Squash https://squash.solo.io/
  - https://kui.tools/

## What does stability mean?

It has a standardized development cycle. Its code is thoroughly tested through lint, unit, integration, and end-to-end testing. Its test, packaging, build, and release process is completely automated.

It has a standardized deployment pipeline, containing staging, canary, and production phases.

Its clients are known.

Its dependencies are known, and there are backups, alternatives, fallbacks, and caching in place in case of failures.

It has stable and reliable routing and discovery in place.

## What does reliability mean?

## What tools helps us achieve reliability?


Stability and Reliability
The Development Cycle
Does the microservice have a central repository where all code is stored?

Do developers work in a development environment that accurately reflects the state of production (e.g., that accurately reflects the real world)?

Are there appropriate lint, unit, integration, and end-to-end tests in place for the microservice?

Are there code review procedures and policies in place?

Is the test, packaging, build, and release process automated?

The Deployment Pipeline
Does the microservice ecosystem have a standardized deployment pipeline?

Is there a staging phase in the deployment pipeline that is either full or partial staging?

What access does the staging environment have to production services?

Is there a canary phase in the deployment pipeline?

Do deployments run in the canary phase for a period of time that is long enough to catch any failures?

Does the canary phase accurately host a random sample of production traffic?

Are the microservice’s ports the same for canary and production?

Are deployments to production done all at the same time, or incrementally rolled out?

Is there a procedure in place for skipping the staging and canary phases in case of an emergency?

Dependencies
What are this microservice’s dependencies?

What are its clients?

How does this microservice mitigate dependency failures?

Are there backups, alternatives, fallbacks, or defensive caching for each dependency?

Routing and Discovery
Are health checks to the microservice reliable?

Do health checks accurately reflect the health of the microservice?

Are health checks run on a separate channel within the communication layer?

Are there circuit breakers in place to prevent unhealthy microservices from making requests?

Are there circuit breakers in place to prevent production traffic from being sent to unhealthy hosts and microservices?

Deprecation and Decommissioning
Are there procedures in place for decommissioning a microservice?

Are there procedures in place for deprecating a microservice’s API endpoints?

## Conclusion

Did I succeed in my goal? Were there atleast 1 new cloud native tool which you havn't come across before? Or are there technologies that you've come across which isn't mentioned here? Reach out and let me know in the comments.

In the next part, we'll explore the different cloud native tooling that helps achieve the scalability and performance principles of production ready microservices.

## Different blog

There is an increasing trend of moving common networking, observability and fault tolernence concerns out of application code and into different cloud-native tooling so that developers are free to focus on implementing business logic which directly correlates with increased profits 💰📈.


<!-- Links  -->

[production-readiness-book]: https://www.amazon.com.au/Production-Ready-Microservices-Standardized-Engineering-Organization/dp/1491965975/ref=asc_df_1491965975/?tag=googleshopdsk-22&linkCode=df0&hvadid=341791741598&hvpos=&hvnetw=g&hvrand=11583469740343046994&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9071462&hvtargid=pla-504426002607&psc=1

[production-ready-talk]: https://www.infoq.com/presentations/production-ready-applications/

[cncf-landspace]: https://landscape.cncf.io/
