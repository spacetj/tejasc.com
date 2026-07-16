import config from "../../content/meta/config";

const siteRoot = `${config.siteUrl}${config.pathPrefix || ""}`.replace(/\/+$/, "");
const websiteId = `${siteRoot}/#website`;
const personId = `${siteRoot}/#person`;
const logitSocialId = "https://logit.social/#organization";

const reference = (id) => ({ "@id": id });

const credentialIds = [
  `${siteRoot}/credentials#gcp-certified-fellow`,
  `${siteRoot}/credentials#certified-kubernetes-administrator`,
  `${siteRoot}/credentials#professional-cloud-architect`,
  `${siteRoot}/credentials#certified-kubernetes-application-developer`,
];

const person = {
  "@type": "Person",
  "@id": personId,
  name: "Tejas Cherukara",
  alternateName: "Tejas C",
  url: `${siteRoot}/about`,
  description:
    "Founder of Logit Social with a cloud-native, platform engineering, observability, and reliability background.",
  email: config.contactEmail,
  jobTitle: "Founder of Logit Social",
  homeLocation: {
    "@type": "City",
    name: "Sydney, NSW, Australia",
  },
  knowsAbout: [
    "Cloud-native platforms",
    "Platform engineering",
    "Kubernetes",
    "Google Cloud",
    "Observability",
    "Site reliability engineering",
  ],
  sameAs: config.authorSocialLinks.map(({ url }) => url),
  worksFor: reference(logitSocialId),
  hasCredential: credentialIds.map(reference),
};

const logitSocial = {
  "@type": "Organization",
  "@id": logitSocialId,
  name: "Logit Social",
  url: "https://logit.social",
  founder: reference(personId),
};

const recognizedBy = {
  googleCloud: {
    "@type": "Organization",
    "@id": "https://cloud.google.com/#organization",
    name: "Google Cloud",
    url: "https://cloud.google.com",
  },
  cncf: {
    "@type": "Organization",
    "@id": "https://www.cncf.io/#organization",
    name: "Cloud Native Computing Foundation",
    url: "https://www.cncf.io",
  },
};

const credentials = [
  {
    "@type": "EducationalOccupationalCredential",
    "@id": credentialIds[0],
    name: "Google Cloud Certified Fellow",
    credentialCategory: "Professional certification",
    dateCreated: "2020-09-28",
    recognizedBy: recognizedBy.googleCloud,
    competencyRequired:
      "Lead enterprise hybrid and multi-cloud adoption, modernize applications, and guide complex cloud transformation.",
    url: credentialIds[0],
  },
  {
    "@type": "EducationalOccupationalCredential",
    "@id": credentialIds[1],
    name: "Certified Kubernetes Administrator",
    credentialCategory: "Professional certification",
    dateCreated: "2019-11-01",
    recognizedBy: recognizedBy.cncf,
    competencyRequired:
      "Install, configure, operate, and troubleshoot production-grade Kubernetes clusters.",
    url: credentialIds[1],
  },
  {
    "@type": "EducationalOccupationalCredential",
    "@id": credentialIds[2],
    name: "Google Cloud Certified Professional Cloud Architect",
    credentialCategory: "Professional certification",
    dateCreated: "2019-04-01",
    expires: "2021-04-01",
    recognizedBy: recognizedBy.googleCloud,
    competencyRequired:
      "Design robust, secure, scalable, cost-effective, and highly available Google Cloud architectures.",
    url: credentialIds[2],
  },
  {
    "@type": "EducationalOccupationalCredential",
    "@id": credentialIds[3],
    name: "Certified Kubernetes Application Developer",
    credentialCategory: "Professional certification",
    dateCreated: "2019-01-05",
    recognizedBy: recognizedBy.cncf,
    competencyRequired:
      "Design, build, configure, expose, observe, and troubleshoot scalable cloud-native applications on Kubernetes.",
    url: credentialIds[3],
  },
];

const videos = [
  {
    "@type": "VideoObject",
    "@id": `${siteRoot}/talks#cloud-next-25-video`,
    name: "Enterprise-grade security and scale for serverless workloads with Cloud Run",
    description:
      "Google Cloud Next 2025 session covering enterprise Cloud Run security, scale, platform engineering, resiliency, productivity, and cost optimisation.",
    thumbnailUrl: "https://i.ytimg.com/vi/EEUZtcYHi78/maxresdefault.jpg",
    uploadDate: "2025-04-11T07:04:27-07:00",
    duration: "PT37M43S",
    embedUrl: "https://www.youtube.com/embed/EEUZtcYHi78",
    url: "https://www.youtube.com/watch?v=EEUZtcYHi78",
    contributor: reference(personId),
    publisher: {
      "@type": "Organization",
      name: "Google Cloud",
      url: "https://www.youtube.com/@googlecloud",
    },
  },
  {
    "@type": "VideoObject",
    "@id": `${siteRoot}/talks#kubesummit-2019-video`,
    name: "OPA Policy Templating and Testing",
    description:
      "KubeSummit Sydney 2019 session about productionising Open Policy Agent policy templating and testing in a large banking environment.",
    thumbnailUrl: "https://i.ytimg.com/vi/tGDAuij5RvE/maxresdefault.jpg",
    uploadDate: "2019-12-12T14:46:08-08:00",
    duration: "PT25M16S",
    embedUrl: "https://www.youtube.com/embed/tGDAuij5RvE",
    url: "https://www.youtube.com/watch?v=tGDAuij5RvE",
    contributor: reference(personId),
    publisher: {
      "@type": "Organization",
      name: "CNCF [Cloud Native Computing Foundation]",
      url: "https://www.youtube.com/@cncf",
    },
  },
];

const projects = [
  {
    "@type": "SoftwareApplication",
    "@id": `${siteRoot}/projects#logit-social-project`,
    name: "Logit Social",
    url: "https://logit.social",
    applicationCategory: "Private journaling application",
    description:
      "A private journaling app for turning real moments into reflections, useful next steps, or trusted Circles conversations.",
    creator: reference(personId),
  },
  {
    "@type": "SoftwareSourceCode",
    "@id": `${siteRoot}/projects#cloud-native-production-readiness`,
    name: "Cloud Native Production Readiness",
    url: "https://github.com/spacetj/production-readiness",
    codeRepository: "https://github.com/spacetj/production-readiness",
    description: "Cloud-native tools for building production-ready applications.",
    contributor: reference(personId),
  },
  {
    "@type": "SoftwareSourceCode",
    "@id": `${siteRoot}/projects#anchorctl`,
    name: "AnchorCTL",
    url: "https://github.com/covarity/anchorctl",
    codeRepository: "https://github.com/covarity/anchorctl",
    runtimePlatform: "Kubernetes",
    description:
      "A command-line utility that enables a test-driven approach to developing distributed systems such as Kubernetes.",
    contributor: reference(personId),
  },
  {
    "@type": "SoftwareSourceCode",
    "@id": `${siteRoot}/projects#website`,
    name: "tejasc.com",
    url: siteRoot,
    codeRepository: "https://github.com/spacetj/tejasc.com",
    programmingLanguage: "JavaScript",
    runtimePlatform: "React and GatsbyJS",
    description: "The React and GatsbyJS source code for Tejas Cherukara's personal website.",
    contributor: reference(personId),
  },
];

const collectionForPage = (slug, pageId) => {
  const collections = {
    "/credentials": {
      id: `${siteRoot}/credentials#credential-list`,
      name: "Professional credentials held by Tejas Cherukara",
      entities: credentials,
    },
    "/talks": {
      id: `${siteRoot}/talks#video-list`,
      name: "Conference talk videos featuring Tejas Cherukara",
      entities: videos,
    },
    "/projects": {
      id: `${siteRoot}/projects#project-list`,
      name: "Selected projects by Tejas Cherukara",
      entities: projects,
    },
  };
  const collection = collections[slug];

  if (!collection) {
    return { mainEntity: null, nodes: [] };
  }

  const entities = collection.entities.map((entity) => ({
    ...entity,
    mainEntityOfPage: reference(pageId),
  }));
  const itemList = {
    "@type": "ItemList",
    "@id": collection.id,
    name: collection.name,
    itemListElement: entities.map((entity, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: reference(entity["@id"]),
    })),
  };

  return {
    mainEntity: reference(itemList["@id"]),
    nodes: [itemList, ...entities],
  };
};

export const buildStructuredData = ({ description, slug, title, url }) => {
  const pageId = `${url}#webpage`;
  const normalizedSlug = slug === "/" ? slug : slug.replace(/\/+$/, "");
  const collection = collectionForPage(normalizedSlug, pageId);
  const isProfilePage = normalizedSlug === "/about";
  const isCollectionPage = collection.nodes.length > 0;
  const page = {
    "@type": isProfilePage ? "ProfilePage" : isCollectionPage ? "CollectionPage" : "WebPage",
    "@id": pageId,
    url,
    name: title,
    description,
    inLanguage: config.siteLanguage,
    isPartOf: reference(websiteId),
    author: reference(personId),
    ...(isProfilePage ? { mainEntity: reference(personId) } : {}),
    ...(collection.mainEntity ? { mainEntity: collection.mainEntity } : {}),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: `${siteRoot}/`,
        name: "Tejas C",
        description: config.siteDescription,
        inLanguage: config.siteLanguage,
        publisher: reference(personId),
      },
      person,
      logitSocial,
      page,
      ...collection.nodes,
    ],
  };
};

export const serializeStructuredData = (data) => JSON.stringify(data).replace(/</g, "\\u003c");
