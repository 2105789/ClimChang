import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, deleteDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMEjsY9p3C0FxhWNDvAUDjKCNj171UWz8",
  authDomain: "clim-71eb2.firebaseapp.com",
  projectId: "clim-71eb2",
  storageBucket: "clim-71eb2.firebasestorage.app",
  messagingSenderId: "938151441437",
  appId: "1:938151441437:web:3a5f1af9834250d44202f4",
  measurementId: "G-B4YW6J84SL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Authors data
const authors = [
  {
    id: 'author-1',
    name: 'Dr. Emma Richardson',
    avatarUrl: 'https://i.pravatar.cc/150?u=emma',
    title: 'Climate Scientist'
  },
  {
    id: 'author-2',
    name: 'James Chen',
    avatarUrl: 'https://i.pravatar.cc/150?u=james',
    title: 'Environmental Journalist'
  },
  {
    id: 'author-3',
    name: 'Sophia Martinez',
    avatarUrl: 'https://i.pravatar.cc/150?u=sophia',
    title: 'Sustainability Advocate'
  }
];

// Updated Categories data
const categories = [
  {
    id: 'cat-1',
    name: 'Science & Research',
    slug: 'science-research',
    description: 'Blogs focusing on the scientific aspects of climate change, including research findings, data analysis, and climate models.'
  },
  {
    id: 'cat-2',
    name: 'Policy & Advocacy',
    slug: 'policy-advocacy',
    description: 'Blogs discussing climate change policies, international agreements, political actions, and advocacy efforts.'
  },
  {
    id: 'cat-3',
    name: 'Sustainability & Solutions',
    slug: 'sustainability-solutions',
    description: 'Blogs highlighting sustainable practices, technological innovations, and solutions for mitigating and adapting to climate change.'
  },
  {
    id: 'cat-4',
    name: 'Environmental Impacts',
    slug: 'environmental-impacts',
    description: 'Blogs detailing the observable effects of climate change on ecosystems, biodiversity, and natural environments.'
  },
  {
    id: 'cat-5',
    name: 'Personal & Lifestyle',
    slug: 'personal-lifestyle',
    description: 'Blogs focusing on individual actions, lifestyle changes, and personal stories related to climate consciousness and sustainable living.'
  },
  {
    id: 'cat-6',
    name: 'Economics & Business',
    slug: 'economics-business',
    description: 'Blogs analyzing the economic implications of climate change, business sustainability, and the green economy.'
  },
  {
    id: 'cat-7',
    name: 'Technology & Innovation',
    slug: 'technology-innovation',
    description: 'Blogs that discuss new technologies, innovations, and engineering solutions to combat climate change, such as renewable energy and carbon capture.'
  },
  {
    id: 'cat-8',
    name: 'Education & Awareness',
    slug: 'education-awareness',
    description: 'Blogs dedicated to educating the public about climate change, its causes, and its effects, and raising awareness.'
  },
  {
    id: 'cat-9',
    name: 'Food & Agriculture',
    slug: 'food-agriculture',
    description: 'Blogs that talk about the impact of climate change on food production, agriculture, and sustainable food systems.'
  },
  {
    id: 'cat-10',
    name: 'Health & Climate',
    slug: 'health-climate',
    description: 'Blogs that discuss the intersection of climate change and human health, including heat stress, disease spread, and air quality.'
  }
];

// Update post categoryIds to match new categories
const posts = [
  {
    id: 'post-1',
    title: 'Understanding the Latest IPCC Report',
    slug: 'understanding-latest-ipcc-report',
    excerpt: 'A breakdown of the key findings from the most recent Intergovernmental Panel on Climate Change report and what it means for our future.',
    content: `
# Understanding the Latest IPCC Report

The Intergovernmental Panel on Climate Change (IPCC) recently released its Sixth Assessment Report, providing the most up-to-date understanding of the climate system and climate change.

## Key Findings

- **Global Temperature Rise**: The report confirms that human activities have warmed the planet by approximately 1.1°C since pre-industrial times.
- **Rate of Change**: Many changes are unprecedented over thousands of years and some, like sea level rise, are irreversible over hundreds to thousands of years.
- **Future Projections**: All emission scenarios assessed show global warming of at least 1.5°C by 2040 without immediate and significant reductions.

## Regional Impacts

Climate change is already affecting every inhabited region across the globe, with human influence contributing to many observed changes in weather and climate extremes:

- Increased heat waves, longer warm seasons, and shorter cold seasons
- Intensified water cycle leading to more intense rainfall and flooding
- Agricultural and ecological droughts in some regions
- Proportion of intense tropical cyclones has increased

## What This Means

The report emphasizes that immediate, rapid, and large-scale reductions in greenhouse gas emissions are necessary to limit warming to 1.5-2°C. Every fraction of a degree matters, as it translates to noticeable differences in extreme weather events, sea level rise, and biodiversity loss.

## Pathways Forward

Achieving the Paris Agreement goals requires:

1. **Net Zero Emissions**: Reaching carbon neutrality by mid-century
2. **Reduced Methane**: Deep reductions in other greenhouse gases, especially methane
3. **Negative Emissions**: Developing carbon dioxide removal technologies
4. **Adaptation**: Implementing strategies to adapt to climate impacts that are now unavoidable

The science is clearer than ever - climate change is widespread, rapid, and intensifying. The window for action is narrowing, but there is still time to prevent the worst impacts if decisive action is taken now.
    `,
    imageUrl: 'https://images.unsplash.com/photo-1593115057322-e94b77572f20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
    publishedAt: {
      seconds: Date.now() / 1000 - 86400 * 20
    },
    categoryId: 'cat-1', // Science & Research
    author: authors[0]
  },
  {
    id: 'post-2',
    title: 'How Ocean Acidification Threatens Marine Ecosystems',
    slug: 'ocean-acidification-marine-ecosystems',
    excerpt: 'Exploring the often-overlooked impact of rising CO2 levels on our oceans and the cascading effects on marine life and food security.',
    content: `
# How Ocean Acidification Threatens Marine Ecosystems

While rising temperatures and sea levels often dominate climate change discussions, ocean acidification represents an equally serious threat to marine ecosystems worldwide.

## The Chemistry Behind Ocean Acidification

When carbon dioxide (CO2) dissolves in seawater, it forms carbonic acid, which increases the acidity of the ocean. Since the beginning of the Industrial Revolution, the ocean has absorbed approximately 30% of anthropogenic CO2 emissions, leading to:

- A 30% increase in ocean acidity (0.1 pH unit decrease)
- The fastest rate of change in ocean chemistry in millions of years
- Projections of further acidity increases of 100-150% by 2100 under high emission scenarios

## Impacts on Marine Life

### Calcifying Organisms

The most direct impact is on organisms that build shells or skeletons from calcium carbonate:

- **Coral Reefs**: Reduced calcification rates and structural integrity
- **Shellfish**: Thinning shells and decreased survival rates in oysters, clams, and mussels
- **Plankton**: Compromised shell formation in pteropods and foraminifera, key components of marine food webs

### Ecosystem-Wide Effects

The consequences extend beyond shell-building organisms:

- **Fish**: Impacts on behavior, sensory systems, and development of fish larvae
- **Food Webs**: Disruption of predator-prey relationships and ecosystem structure
- **Biodiversity**: Reduced diversity as sensitive species decline

## Economic and Social Implications

Ocean acidification threatens:

- **Food Security**: Global fisheries and aquaculture provide protein for billions of people
- **Coastal Protection**: Healthy coral reefs buffer coastlines from storms and erosion
- **Economic Livelihoods**: Communities dependent on fishing and tourism face uncertainty

## Mitigation and Adaptation Strategies

Addressing ocean acidification requires:

1. **Reducing CO2 Emissions**: The only long-term solution to prevent further acidification
2. **Local Management**: Reducing other stressors on marine ecosystems to increase resilience
3. **Adaptive Aquaculture**: Developing farming techniques for acidification-resistant species
4. **Research**: Continued monitoring and studies to understand vulnerability and adaptation potential

Ocean acidification represents a profound threat to marine ecosystems that requires immediate attention and action alongside other climate change mitigation efforts.
    `,
    imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    publishedAt: {
      seconds: Date.now() / 1000 - 86400 * 15
    },
    categoryId: 'cat-4', // Environmental Impacts
    author: authors[1]
  },
  {
    id: 'post-3',
    title: 'The Rise of Sustainable Architecture',
    slug: 'rise-of-sustainable-architecture',
    excerpt: 'Innovative building designs that are reshaping urban landscapes while minimizing environmental impact and energy consumption.',
    content: `
# The Rise of Sustainable Architecture

Architecture is undergoing a profound transformation as the industry embraces sustainability principles to address climate change and resource depletion.

## Key Principles of Sustainable Architecture

### Energy Efficiency

Modern sustainable buildings prioritize energy conservation through:

- **Passive Design**: Orienting buildings to maximize natural lighting and ventilation
- **High-Performance Envelopes**: Advanced insulation and smart windows to reduce heating and cooling needs
- **Efficient Systems**: State-of-the-art HVAC, lighting, and appliances that minimize energy use
- **Renewable Energy**: On-site solar, wind, and geothermal systems to generate clean energy

### Materials and Resources

Sustainable buildings carefully consider material choices:

- **Embodied Carbon**: Selecting materials with lower lifetime carbon footprints
- **Recycled Content**: Using materials with post-consumer and post-industrial recycled content
- **Local Sourcing**: Reducing transportation emissions by using locally available materials
- **Durability**: Designing for longevity to reduce replacement and maintenance

### Water Conservation

Innovative water management strategies include:

- **Rainwater Harvesting**: Collection systems for irrigation and non-potable uses
- **Greywater Reuse**: Recycling water from sinks and showers for toilet flushing and landscape irrigation
- **Efficient Fixtures**: Low-flow toilets, faucets, and showerheads that reduce consumption
- **Landscaping**: Native, drought-resistant plants that require minimal irrigation

## Iconic Examples of Sustainable Architecture

### The Edge (Amsterdam)

Often called the world's most sustainable office building, The Edge features:
- 28,000 sensors monitoring occupancy, lighting, temperature, and energy use
- A massive solar panel array that produces more energy than the building consumes
- Smart design that assigns workspaces based on employees' schedules

### Bosco Verticale (Milan)

These residential towers incorporate:
- Over 900 trees and 20,000 plants integrated into the facades
- Natural cooling and improved air quality through vegetation
- Biodiversity support in an urban environment

## Benefits Beyond Environmental Impact

Sustainable architecture delivers multiple advantages:

- **Economic Benefits**: Lower operating costs and higher property values
- **Health Improvements**: Better indoor air quality and connection to nature
- **Resilience**: Greater adaptability to changing climate conditions
- **Social Value**: Community spaces that promote well-being and connection

## The Future of Sustainable Architecture

The industry continues to evolve with:

- **Net-Positive Buildings**: Structures that generate more resources than they consume
- **Biophilic Design**: Deeper integration of nature into the built environment
- **Circular Economy Principles**: Designing buildings for eventual disassembly and material reuse
- **Smart Systems**: AI and IoT technologies that continuously optimize building performance

Sustainable architecture represents not just a trend but a necessary evolution in how we design and construct the built environment in response to our climate crisis.
    `,
    imageUrl: 'https://images.unsplash.com/photo-1518005068251-37900150dfca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
    publishedAt: {
      seconds: Date.now() / 1000 - 86400 * 10
    },
    categoryId: 'cat-3', // Sustainability & Solutions
    author: authors[2]
  },
  {
    id: 'post-4',
    title: 'The Paris Agreement: Progress and Challenges',
    slug: 'paris-agreement-progress-challenges',
    excerpt: 'Analyzing the achievements and shortcomings of the landmark climate accord five years after its adoption.',
    content: `
# The Paris Agreement: Progress and Challenges

The Paris Agreement, adopted in 2015, marked a historic moment in global climate governance. As we assess its impact years later, we find both encouraging developments and persistent challenges.

## The Agreement's Core Elements

The Paris Agreement established several groundbreaking components:

- **Nationally Determined Contributions (NDCs)**: Countries submit voluntary climate action plans
- **Global Temperature Goal**: Limiting warming to well below 2°C, preferably 1.5°C
- **Global Stocktake**: Regular assessment of collective progress every five years
- **Climate Finance**: Support for developing nations from developed countries
- **Transparency Framework**: Regular reporting and review of actions and support

## Progress Made

### Global Momentum

- **Near-Universal Participation**: 196 parties have joined the agreement
- **Net-Zero Pledges**: Over 70 countries have announced carbon neutrality targets
- **Renewable Growth**: Dramatic acceleration in clean energy deployment
- **Financial Shifts**: Major investors are divesting from fossil fuels and increasing sustainable investments

### Policy Transformation

- **National Legislation**: Many countries have enacted domestic climate laws
- **Carbon Pricing**: Expansion of carbon markets and taxes across regions
- **Sectoral Policies**: Proliferation of clean energy standards and fossil fuel phaseout plans

## Persistent Challenges

### Ambition Gap

Current NDCs remain insufficient:
- Pledges put the world on track for 2.7°C warming by 2100
- Many countries' actions lag behind their stated commitments
- The critical 2020-2030 decade requires far steeper emissions cuts

### Implementation Barriers

- **Political Shifts**: Changing governments and priorities threaten consistency
- **Economic Pressures**: Short-term economic concerns often override climate action
- **Technological Constraints**: Key technologies for deep decarbonization still need scaling

### Equity Issues

- **Climate Finance**: Promised funding for developing nations has fallen short
- **Loss and Damage**: Insufficient mechanisms to address climate impacts already occurring
- **Just Transition**: Inadequate support for communities dependent on fossil fuel industries

## Looking Forward

The Paris Agreement's success ultimately depends on:

1. **Increased Ambition**: Countries must strengthen their NDCs before 2025
2. **Implementation Focus**: Converting pledges into concrete policies and actions
3. **Financial Mobilization**: Scaling up climate finance to trillions of dollars annually
4. **Technological Innovation**: Accelerating research, development, and deployment of clean technologies
5. **Inclusive Approach**: Ensuring the transition is equitable across countries and communities

While the Paris Agreement created an essential framework for global climate action, its promise will only be fulfilled through significantly accelerated implementation efforts in this decisive decade.
    `,
    imageUrl: 'https://images.unsplash.com/photo-1532339142463-fd0a8979791a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    publishedAt: {
      seconds: Date.now() / 1000 - 86400 * 7
    },
    categoryId: 'cat-2', // Policy & Advocacy
    author: authors[0]
  },
  {
    id: 'post-5',
    title: 'Carbon Capture: Promise or Distraction?',
    slug: 'carbon-capture-promise-distraction',
    excerpt: 'Evaluating the potential of carbon capture technologies in climate mitigation strategies and their appropriate role in achieving net-zero emissions.',
    content: `
# Carbon Capture: Promise or Distraction?

As the climate crisis intensifies, carbon capture technologies have emerged as both a source of hope and controversy. Do they represent an essential tool in our climate mitigation toolkit, or a dangerous distraction from necessary emissions reductions?

## Understanding Carbon Capture Technologies

Carbon capture encompasses several distinct approaches:

### Point-Source Carbon Capture and Storage (CCS)

- Captures CO₂ emissions directly from power plants or industrial facilities
- Transports and stores the captured carbon in underground geological formations
- Currently operational at several dozen facilities worldwide

### Direct Air Capture (DAC)

- Extracts CO₂ directly from the ambient air
- Can address emissions from distributed sources like transportation
- Emerging technology with high current costs ($250-600 per ton of CO₂)

### Natural Carbon Removal

- Enhances natural carbon sinks through reforestation, soil management, etc.
- Generally lower cost but with land use implications
- Provides co-benefits for biodiversity and ecosystem services

## The Case for Carbon Capture

### Climate Math

According to the IPCC and other analyses:
- Many pathways to 1.5°C rely heavily on negative emissions technologies
- Some sectors (cement, steel, aviation) will be extremely difficult to fully decarbonize
- Historical emissions already commit us to removing carbon from the atmosphere

### Economic Considerations

- Protects jobs in regions dependent on fossil fuel infrastructure
- Creates new economic opportunities and technological leadership
- May provide lower-cost pathways to deep decarbonization in certain contexts

## The Case Against Over-Reliance

### Moral Hazard

- Risk of delaying necessary emissions reductions in the near term
- May provide political cover for continued fossil fuel expansion
- Could lead to intergenerational injustice if technologies fail to scale

### Technological Uncertainties

- Limited deployment at scale to date
- Energy intensity of direct air capture processes
- Storage capacity constraints and monitoring challenges

### Resource Requirements

- Land use conflicts for bioenergy with carbon capture (BECCS)
- Water consumption concerns, particularly in water-stressed regions
- High capital investment needs that could be directed to renewable energy

## Finding the Right Balance

A nuanced approach recognizes:

1. **Prioritizing Emissions Reductions**: Carbon capture should supplement, not replace, rapid decarbonization
2. **Strategic Deployment**: Focus on hard-to-abate sectors where alternatives don't exist
3. **Portfolio Approach**: Developing multiple carbon removal methods rather than betting on a single solution
4. **Just Transition**: Ensuring carbon capture deployment doesn't extend fossil fuel injustices
5. **Enhanced Research**: Accelerating innovation to reduce costs and improve efficiency

Carbon capture technologies likely have an important role in a comprehensive climate strategy, but that role must be carefully defined to avoid undermining more fundamental system changes needed to address climate change.
    `,
    imageUrl: 'https://images.unsplash.com/photo-1611273426858-450e7846dca2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    publishedAt: {
      seconds: Date.now() / 1000 - 86400 * 4
    },
    categoryId: 'cat-7', // Technology & Innovation
    author: authors[1]
  },
  {
    id: 'post-6',
    title: 'Climate Justice: Centering Equity in Climate Action',
    slug: 'climate-justice-equity',
    excerpt: 'Why addressing historical inequities and ensuring a just transition must be at the core of effective climate policy.',
    content: `
# Climate Justice: Centering Equity in Climate Action

Climate change is not merely an environmental issue but a profound social justice challenge. Its impacts and solutions are inextricably linked to questions of equity, human rights, and historical responsibility.

## Understanding Climate Justice

Climate justice recognizes several key dimensions:

### Disproportionate Impacts

- **Geographic Inequity**: Nations least responsible for emissions often face the most severe impacts
- **Economic Vulnerability**: Low-income communities have fewer resources to adapt and recover
- **Intergenerational Injustice**: Future generations inherit climate consequences without having contributed to the problem
- **Indigenous Communities**: Face unique threats to cultural practices and traditional lands

### Historical Responsibility

- **Differentiated Contributions**: Developed nations have contributed approximately 79% of historical carbon emissions
- **Colonial Legacy**: Climate vulnerability often maps onto past colonial exploitation
- **Continuing Emissions Inequality**: Per capita emissions remain vastly higher in wealthy nations

## Key Principles of Climate Justice

### Procedural Justice

Ensuring fair participation in decision-making processes:
- Meaningful inclusion of marginalized communities in climate policy development
- Respecting indigenous knowledge and sovereignty
- Transparent and accessible climate governance institutions

### Distributive Justice

Equitably sharing benefits and burdens:
- Fair allocation of remaining carbon budget
- Equitable distribution of climate finance and technology
- Protecting vulnerable communities from disproportionate adaptation costs

### Restorative Justice

Addressing historical harms:
- Compensation for loss and damage from climate impacts
- Restoration of degraded ecosystems
- Recognition of climate debt owed by high-emitting nations

## Climate Justice in Practice

### Just Transition

- Supporting workers and communities dependent on fossil fuel industries
- Creating quality green jobs accessible to marginalized groups
- Ensuring energy access and affordability during the transition

### Community-Led Initiatives

- Local renewable energy cooperatives
- Urban climate resilience planning by affected communities
- Indigenous-led conservation and ecosystem restoration

### International Equity Mechanisms

- Loss and damage funds for climate-vulnerable nations
- Technology transfer programs that respect intellectual sovereignty
- Climate finance that addresses both mitigation and adaptation needs

## The Path Forward

Advancing climate justice requires:

1. **Restructured Decision-Making**: Moving beyond tokenism to meaningful power-sharing
2. **Rights-Based Approaches**: Recognizing climate action as fulfillment of human rights obligations
3. **Intersectional Analysis**: Addressing how climate impacts intersect with other forms of marginalization
4. **Economic Transformation**: Questioning growth-centric models that perpetuate inequality
5. **Local Leadership**: Supporting frontline communities leading climate solutions

Climate justice reminds us that how we respond to climate change is as important as whether we respond. Just solutions must address root causes of vulnerability while building more equitable, resilient communities.
    `,
    imageUrl: 'https://images.unsplash.com/photo-1621504450181-5d356f61d307?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    publishedAt: {
      seconds: Date.now() / 1000 - 86400 * 2
    },
    categoryId: 'cat-2', // Policy & Advocacy
    author: authors[2]
  }
];

// Function to upload a document with a specific ID
async function uploadDocument(collectionName, documentId, data) {
  try {
    await setDoc(doc(db, collectionName, documentId), data);
    console.log(`Uploaded ${collectionName} document with ID: ${documentId}`);
  } catch (error) {
    console.error(`Error uploading ${collectionName} document:`, error);
  }
}

// Function to clear a collection before uploading
async function clearCollection(collectionName, documents) {
  try {
    for (const document of documents) {
      await deleteDoc(doc(db, collectionName, document.id));
      console.log(`Deleted ${collectionName} document with ID: ${document.id}`);
    }
  } catch (error) {
    console.error(`Error clearing ${collectionName} collection:`, error);
  }
}

// Main function to upload all data
async function uploadData() {
  console.log('Starting database seed...');
  
  // Clear collections first
  await clearCollection('categories', categories);
  await clearCollection('posts', posts);
  
  // Upload categories
  for (const category of categories) {
    await uploadDocument('categories', category.id, category);
  }
  
  // Upload posts
  for (const post of posts) {
    await uploadDocument('posts', post.id, post);
  }
  
  console.log('Database seed completed successfully!');
}

// Run the upload
uploadData().then(() => {
  console.log('Seed script completed!');
}).catch(error => {
  console.error('Error in seed script:', error);
}); 