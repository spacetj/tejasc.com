---
title: Stability and Reliability
subTitle: Cloud Native Production Readiness Part 1
cover: stability.jpeg
category: "cloud-native"
publish: "true"
---

What does it mean for an application to be production ready? Thankfully industry leaders a lot smarter than me have given this a lot of thought!

If you havn't come across these resources yet, it is recommended  to go through them before reading this post:

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

As technology evolves, there are several tools that help achieve each of these tenets of production readiness mentioned above. In this series of blog posts, I'll be exploring the different cloud native tools which helps implement these principles. My goal for this series is to introduce you to atleast 1 new tools which you might not have come across before.

The tools mentioned in this blog are just examples of tools available, and might not be the best suited for your usecase. Hopefully this will give you a starting point so you can research the tools that is most appropriate for your ecosystem.

### Assumptions

In these series of posts, I'll be exploring application that are:

- Running in kubernetes
- Exploring tools that are Cloud Native mostly from [CNCF Landscape][cncf-landspace]

---

## Principles

Stability and Realiability is the first 2 production readiness principles mentioned in the book.

> Stability: Development, deployment and adoption of new technologies do not give rise to instability across the larger microservice ecosystem.

> Reliability: One that can be trusted by other microservices and by the overall system.

These principles ensures that applications:

- have standardized development, testing and debugging cycles
- are build and packaged in a standardized and automated fashion
- has stable and reliable routing and discovery

### Testing & Debugging

- With the mass adoption of Kubernetes, came the influx of tools that enable creating local kubernetes clusters. A few of those tools are:
  - KinD (Kubernetes in Docker)
  - Minikube 
  - Docker for Desktop
- Demystifying Kubernetes: Debugging: Squash https://squash.solo.io/
- https://kui.tools/ + https://github.com/vmware-tanzu/octant
- Cloud Code vs Skaffold
- Cloud Debugger vs Delve

### Build and Packaging

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

### Continuous Delivery

- Spinnaker
- Flagger: https://docs.flagger.app/
- Client Side: https://werf.io/introduction.html
- Flux: Gitops: https://docs.fluxcd.io/en/latest/
- Keptn: https://keptn.sh/
  - Keptn + Argo: https://tutorials.keptn.sh/tutorials/keptn-argo-cd-deployment-07/index.html?index=..%2F..index#9
- ArgoCD:
- https://github.com/hyscale/hyscale: Abstraction layer on top of kubernetes
- Application Manager

### Routing and Discovery

- Kubernetes: Best practices in kubernetes such as ensuring readinessProbes and livenessProbes are configured correctly helps ensure the reliability of your application, offloading those concerns to the container orchestration tool. Use of kubernetes services ensure that services are discoverable and routable throughout the cluster.


## Conclusion

Did I succeed in my goal? Were there atleast 1 new cloud native tool which you havn't come across before? Or are there technologies that you've come across which isn't mentioned here? Reach out and let me know in the comments.

In the next part, we'll explore the different cloud native tooling that helps achieve the scalability and performance principles of production ready microservices.



<!-- Links  -->

[production-readiness-book]: https://www.amazon.com.au/Production-Ready-Microservices-Standardized-Engineering-Organization/dp/1491965975/ref=asc_df_1491965975/?tag=googleshopdsk-22&linkCode=df0&hvadid=341791741598&hvpos=&hvnetw=g&hvrand=11583469740343046994&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9071462&hvtargid=pla-504426002607&psc=1

[production-ready-talk]: https://www.infoq.com/presentations/production-ready-applications/

[cncf-landspace]: https://landscape.cncf.io/
