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

As technology evolves, several tools have emerged which helps achieve the tenets of production readiness mentioned above. These series of blog posts will be exploring the different cloud native tools which helps implement these principles.

**DISCLAIMER** The tools mentioned in this blog are just examples of tools available, and might not be the best suited for your usecase. The blog can serve as a starting point to research the tools that is most appropriate for your ecosystem.

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

---

### Testing & Debugging

- With the mass adoption of Kubernetes, came the influx of tools that enable creating local kubernetes clusters. A few of those tools are:
  - [KinD][kind]: Why run containers when you can run containers inside containers which orchestrates other containers.
  - [Minikube][minikube]: Single node kube cluster on your PC
  - Docker for Desktop: A kubernetes cluster build into your Docker for Desktop application

- Did you know that `kubectl` has close to 300 different variations of commands? Actually I have no idea if that's true or what the real number is, but I bet you believed it for a second! Such is the complexity of the tooling we deal with. Different kubernetes UI tools have helped demystify kubernetes and reduce it's complexity for developers
  - [KUI](https://kui.tools/): CLI driven UI for kubernetes, similar to k9s (although that is no longer opensource).
  - [Octant][octant]: A UI for developers which combines introspective tooling, cluster navigation and object management to help demystify kubernetes clusters and its objects.

![](./assets/octant.png)

- Further to the complexity of understanding kubernetes is the complexity that comes with working with distributed applications, running in different cluster, across different nodes and replicas. A few tools that help work in such ecosystem:
- Cloud Code vs Skaffold
- Cloud Debugger vs Delve vs Debugging: Squash https://squash.solo.io/

---

### Build and Packaging

- Ever since the introduction of dockerfiles, it works on my machine is no longer an excuse for my crappy code. Since it's initial introduction, many enhancements have been made to help developers get up and running with containers quickly:
  - kaniko: Docker's cooler, faster (when cached), secure younger cousin. A build tool by Google which doesn't use the docker daemon, and can cache layers to make your builds faster.
  - buildpacks: Buildpacks are like the guy you gf keeps telling you not to worry about. Cloud Native Buildpacks embrace modern container standards, such as the OCI image format. They take advantage of the latest capabilities of these standards, such as cross-repository blob mounting and image layer "rebasing" on Docker API v2 registries.
  - jib: For all of you Java fans (But why?) out there, maven / gradle plugin for optimised OCI images without a docker daemon.
  - ko: Quick and easy container building for Golang applications without dockerfiles or docker. KO executes `go build` on your local machine thus not requiring docker to be install. It can also populate kubernetes manifests with image references.

![](./assets/image-build.jpeg)

- Manifest packaging:
  - [Helm](https://helm.sh/): Ever wanted to use yaml as a programming language? Well, you still can't. But this is the cloest thing we'll get to it. Helm helps template yaml, package and manage deployments of kubernetes manifests.
  - [Tanka](https://tanka.dev/): Use Jsonnet to create kubernetes manifests. Similar to ksonnet (now deprecated), Tanka maintains the kubernetes jsonnet library helping create DRY manifests.

---

### Continuous Delivery

- Spinnaker: Open source, multi cloud platform developed by Netflix and Google to deploy software changes with confidence. With 10 microservices, spinnaker is one of the more complex CD tools in the ecosystem with great support for canary deployments 
- Flux: Gitops: https://docs.fluxcd.io/en/latest/
- ArgoCD
- Application Manager

## Conclusion

Did I succeed in my goal? Were there atleast 1 new cloud native tool which you havn't come across before? Or are there technologies that you've come across which isn't mentioned here? Reach out and let me know in the comments.

In the next part, we'll explore the different cloud native tooling that helps achieve the scalability and performance principles of production ready microservices.


<!-- Links  -->

[production-readiness-book]: https://www.amazon.com.au/Production-Ready-Microservices-Standardized-Engineering-Organization/dp/1491965975/ref=asc_df_1491965975/?tag=googleshopdsk-22&linkCode=df0&hvadid=341791741598&hvpos=&hvnetw=g&hvrand=11583469740343046994&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9071462&hvtargid=pla-504426002607&psc=1

[production-ready-talk]: https://www.infoq.com/presentations/production-ready-applications/

[cncf-landspace]: https://landscape.cncf.io/

[kind]: https://kind.sigs.k8s.io/docs/user/quick-start/

https://github.com/csantanapr/knative-kind

[octant]: https://github.com/vmware-tanzu/octant

[minikube]: https://minikube.sigs.k8s.io/docs/start/
