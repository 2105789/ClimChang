import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

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

// Authors data (reusing the same authors)
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

// Additional posts for empty categories
const additionalPosts = [
  // Cat-5: Personal & Lifestyle
  {
    id: 'post-7',
    title: 'Five Impactful Changes for a Low-Carbon Lifestyle',
    slug: 'five-impactful-changes-low-carbon-lifestyle',
    excerpt: 'Practical steps you can take in your daily life to meaningfully reduce your carbon footprint while improving your well-being.',
    content: `
# Five Impactful Changes for a Low-Carbon Lifestyle

While systemic change is essential for addressing climate change, individual actions still matter—both for reducing emissions and for creating social momentum toward broader transformation.

## Beyond the Basics: High-Impact Personal Changes

Most of us are familiar with basic eco-friendly practices like recycling or using reusable bags. Here are five more impactful changes that can significantly reduce your carbon footprint:

### 1. Rethink Your Diet

**The Impact**: Food production accounts for approximately 26% of global greenhouse gas emissions.

**Effective Changes**:
- **Reduce meat consumption**: Particularly beef and lamb, which have the highest carbon footprints
- **Minimize food waste**: Plan meals carefully and use leftovers creatively
- **Choose local and seasonal**: Reduce transportation emissions and support local food systems
- **Try plant-based days**: Even part-time vegetarianism or veganism makes a difference

A plant-rich diet can reduce your food-related carbon footprint by up to 70% compared to a diet high in animal products.

### 2. Transform Your Transportation

**The Impact**: Transportation is responsible for about 24% of direct CO₂ emissions from fuel combustion.

**Effective Changes**:
- **Embrace active mobility**: Walking or cycling for short trips improves health and eliminates emissions
- **Use public transit**: One full bus can replace 40 single-occupancy vehicles 
- **Consider an electric vehicle**: If you must drive, EVs reduce emissions (especially as grids get cleaner)
- **Limit air travel**: One transatlantic flight can equal months of your other emissions

For unavoidable flights, consider carbon offsetting through verified high-quality projects.

### 3. Make Your Home Energy-Efficient

**The Impact**: Residential energy use accounts for about 17% of global greenhouse gas emissions.

**Effective Changes**:
- **Upgrade insulation**: Proper insulation can reduce heating/cooling energy by 20-30%
- **Switch to heat pumps**: They're 3-5 times more efficient than traditional heating systems
- **Use smart thermostats**: Automatically adjust temperatures to save energy
- **Choose renewable electricity**: Many utilities offer green energy options

Energy efficiency improvements often pay for themselves through lower utility bills.

### 4. Practice Mindful Consumption

**The Impact**: Everything we buy has embedded carbon from production, transportation, and eventual disposal.

**Effective Changes**:
- **Embrace durability**: Choose quality items that will last years, not months
- **Repair, don't replace**: Learn basic repair skills or use repair services
- **Share and borrow**: Tool libraries, car sharing, and community resources reduce individual consumption
- **Buy secondhand**: Extend the lifecycle of existing products

Ask yourself: "Do I need this, or do I just want it?" before making purchases.

### 5. Engage Your Community

**The Impact**: Individual actions multiply when they inspire and involve others.

**Effective Changes**:
- **Start conversations**: Discuss climate solutions with friends, family, and colleagues
- **Support climate-friendly businesses**: Your spending is a powerful signal
- **Join community initiatives**: Garden shares, repair cafés, and climate action groups
- **Advocate for systemic change**: Contact representatives about climate policies

Remember that your influence extends beyond your direct emissions.

## Finding Balance and Avoiding Burnout

Adopting a low-carbon lifestyle doesn't mean perfect purity or deprivation:

- **Start where you can**: Choose changes that fit your circumstances
- **Celebrate progress**: Acknowledge your positive impact rather than focusing on what you can't do
- **Connect with community**: Sharing the journey makes it more sustainable
- **Find joy in the process**: Many climate-friendly changes enhance quality of life

By making conscious choices that align with climate stability, you contribute to a critical cultural shift while reducing your personal impact.
    `,
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1613&q=80',
    publishedAt: {
      seconds: Date.now() / 1000 - 86400 * 1
    },
    categoryId: 'cat-5',
    author: authors[2]
  },
  
  // Cat-6: Economics & Business
  {
    id: 'post-8',
    title: 'ESG Investing: Promise and Pitfalls',
    slug: 'esg-investing-promise-pitfalls',
    excerpt: 'A critical examination of environmental, social, and governance investing and its actual impact on climate change mitigation.',
    content: `
# ESG Investing: Promise and Pitfalls

Environmental, Social, and Governance (ESG) investing has grown exponentially, reaching over $35 trillion in assets under management. But does this investment approach genuinely accelerate climate action, or is it simply a new form of greenwashing?

## The Evolution of ESG

ESG investing has evolved from earlier forms of socially responsible investing:

- **Early Days**: Simple exclusionary screening (avoiding tobacco, weapons, etc.)
- **Integration**: Incorporating ESG factors into financial analysis
- **Impact Investing**: Intentionally pursuing positive environmental and social outcomes alongside financial returns
- **Present Day**: Mainstreaming of ESG across investment strategies and asset classes

This rapid growth has been driven by increasing awareness of climate risks, changing consumer preferences, and emerging regulations.

## The Promise of ESG

Proponents argue that ESG investing offers several powerful mechanisms for climate action:

### Capital Reallocation

ESG investing can:
- Direct capital toward climate solutions and away from high-carbon industries
- Lower the cost of capital for sustainable companies
- Signal market preferences to corporate leadership

### Corporate Influence

Through:
- Shareholder engagement and proxy voting
- Pressuring companies to disclose emissions and set targets
- Using investor leverage to drive corporate climate commitments

### Market Transformation

By:
- Mainstreaming climate considerations across financial markets
- Creating incentives for new climate-friendly products and services
- Building momentum for broader sustainable finance initiatives

## The Pitfalls and Limitations

Despite its potential, ESG investing faces significant challenges:

### Measurement Problems

- **Inconsistent Metrics**: Different ESG ratings can give contradictory assessments of the same company
- **Data Gaps**: Especially in scope 3 emissions and supply chain impacts
- **Aggregation Issues**: Environmental factors often get diluted when combined with social and governance factors

### Greenwashing Concerns

- **Low Standards**: Many "ESG funds" have minimal climate requirements
- **Relative Scoring**: Companies may score well against peers while still having significant emissions
- **Portfolio Construction**: ESG funds often still hold fossil fuel companies

### Real-World Impact Questions

Research shows mixed results on whether ESG investing:
- Significantly reduces portfolio carbon footprints
- Actually changes corporate behavior
- Delivers real-world emissions reductions

## Finding the Most Effective Approach

For investors genuinely concerned about climate change:

### Beyond Basic ESG

- **Climate-Focused Strategies**: Specialized funds targeting climate solutions or net-zero alignment
- **Impact Metrics**: Looking for measurable climate outcomes, not just improved ESG scores
- **Active Ownership**: Funds that actively engage with companies on climate targets

### Complementary Actions

ESG investing works best when combined with:
- Policy advocacy for carbon pricing and climate regulation
- Direct support for climate innovation
- Consumer and employee pressure on corporations

## The Future of Climate Finance

The ESG landscape is evolving rapidly:

- **Better Standards**: New climate disclosure requirements and taxonomy efforts
- **Climate Stress Testing**: Financial institutions increasingly assessing climate risks
- **Targeted Products**: More specialized climate investment products

While ESG investing alone cannot solve climate change, improved practices can make it a more powerful tool in our broader climate response toolkit.
    `,
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    publishedAt: {
      seconds: Date.now() / 1000 - 86400 * 3
    },
    categoryId: 'cat-6',
    author: authors[1]
  },
  
  // Cat-8: Education & Awareness
  {
    id: 'post-9',
    title: 'Teaching Climate Change: Best Practices for Educators',
    slug: 'teaching-climate-change-best-practices-educators',
    excerpt: 'Evidence-based approaches for educators to effectively teach climate science while fostering hope and agency in students.',
    content: `
# Teaching Climate Change: Best Practices for Educators

Climate change education presents unique challenges for teachers at all levels. How do we convey the scientific gravity of the situation while empowering rather than overwhelming students?

## Understanding the Challenges

Research has identified several barriers to effective climate education:

### Knowledge Barriers

- **Complexity**: Climate science spans multiple disciplines
- **Misconceptions**: Common misunderstandings about weather versus climate
- **Curriculum Gaps**: Limited formal coverage in many educational standards

### Psychological Barriers

- **Eco-Anxiety**: Students experiencing distress about climate futures
- **Psychological Distance**: The perception that climate change is remote in time and space
- **Identity Protection**: Resistance when climate facts challenge worldviews

## Evidence-Based Teaching Approaches

### 1. Lead with Solutions

Research shows that solutions-focused climate education:
- Increases student engagement and sense of agency
- Reduces eco-anxiety and feelings of helplessness
- Creates more sustained interest in climate topics

**Classroom Strategies**:
- Begin units with exploration of climate solutions before delving into problems
- Assign projects where students design or implement climate solutions
- Highlight success stories and positive developments

### 2. Localize Climate Impacts

Students engage more deeply when climate change is connected to their lived experience:

**Classroom Strategies**:
- Analyze local climate data and observed changes
- Invite community members to share observations of environmental shifts
- Conduct field studies in local ecosystems showing climate impacts
- Connect global patterns to regional phenomena students can observe

### 3. Foster Critical Media Literacy

In an era of misinformation, students need tools to evaluate climate information:

**Classroom Strategies**:
- Analyze media coverage of climate events for accuracy and bias
- Compare scientific sources with popular media representations
- Examine the sources of climate misinformation and their motivations
- Practice distinguishing between scientific consensus and unsupported claims

### 4. Embrace Interdisciplinary Approaches

Climate change transcends traditional subject boundaries:

**Classroom Strategies**:
- Incorporate climate themes across subjects (art, literature, economics, etc.)
- Use project-based learning that integrates multiple disciplines
- Collaborate with colleagues on cross-curricular climate units
- Connect scientific data with ethical considerations and policy implications

### 5. Address Emotions Constructively

Effective climate education acknowledges and works with emotional responses:

**Classroom Strategies**:
- Create safe spaces for students to express climate concerns
- Balance honest discussion of risks with pathways for action
- Use art, writing, and discussion to process complex feelings
- Connect students with communities taking climate action

## Age-Appropriate Frameworks

### Elementary (K-5)

- Focus on concrete, observable aspects of climate and weather
- Emphasize care for nature and simple conservation actions
- Use stories and hands-on activities rather than abstract concepts
- Connect climate to familiar animals, plants, and seasons

### Middle School (6-8)

- Introduce basic climate mechanisms and carbon cycle
- Connect global concepts to local observations
- Explore personal and community actions
- Begin examining climate justice dimensions

### High School (9-12)

- Deepen understanding of climate systems and feedback loops
- Analyze data and evaluate evidence
- Examine social, political, and economic dimensions
- Explore career pathways in climate solutions

## Measuring Success

Effective climate education should lead to:
- Improved understanding of key climate science concepts
- Increased sense of agency and efficacy
- Development of critical thinking skills about environmental information
- Greater engagement with climate solutions
- Sustained interest in climate-related topics

By implementing these evidence-based approaches, educators can help students navigate the complex reality of climate change while developing the knowledge, skills, and attitudes needed to contribute to solutions.
    `,
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1722&q=80',
    publishedAt: {
      seconds: Date.now() / 1000 - 86400 * 5
    },
    categoryId: 'cat-8',
    author: authors[0]
  },
  
  // Cat-9: Food & Agriculture
  {
    id: 'post-10',
    title: 'Regenerative Agriculture: Beyond Sustainable Farming',
    slug: 'regenerative-agriculture-beyond-sustainable-farming',
    excerpt: 'How regenerative farming practices are revolutionizing agriculture while offering powerful climate mitigation and adaptation benefits.',
    content: `
# Regenerative Agriculture: Beyond Sustainable Farming

While sustainable agriculture aims to maintain resources without depletion, regenerative agriculture goes further—actively rebuilding soil health, enhancing biodiversity, and sequestering carbon.

## Core Principles of Regenerative Agriculture

Unlike conventional farming that often focuses on single solutions, regenerative agriculture employs a holistic approach based on several interconnected principles:

### 1. Minimal Soil Disturbance

**Practices**:
- No-till or reduced tillage methods
- Direct seeding into untilled soil
- Preservation of soil structure and fungal networks

**Benefits**:
- Reduced erosion and soil loss
- Preserved soil biology and microbial communities
- Decreased carbon release from disturbed soil

### 2. Soil Coverage

**Practices**:
- Cover cropping between main crop cycles
- Mulching exposed soil surfaces
- Leaving crop residues after harvest

**Benefits**:
- Reduced water evaporation and temperature fluctuations
- Protected soil from wind and water erosion
- Suppressed weed growth naturally

### 3. Biodiversity Enhancement

**Practices**:
- Diverse crop rotations with multiple species
- Intercropping and companion planting
- Integration of flowering species for pollinators
- Habitat preservation for beneficial insects and wildlife

**Benefits**:
- Natural pest management through predator-prey relationships
- Improved nutrient cycling and availability
- Enhanced resilience to disease and climate stress

### 4. Living Root Systems

**Practices**:
- Maintaining living plants year-round
- Using perennial crops where appropriate
- Minimizing fallow periods

**Benefits**:
- Continuous carbon pumping into soil
- Sustained food sources for soil biology
- Improved soil structure through root channels

### 5. Livestock Integration

**Practices**:
- Planned rotational grazing
- Multi-species grazing systems
- Animal impact as a management tool

**Benefits**:
- Enhanced nutrient cycling through manure distribution
- Conversion of cellulose to soil fertility via ruminants
- Mimicking natural ecosystem functions

## Climate Mitigation Potential

Research shows that regenerative agriculture offers significant climate benefits:

### Carbon Sequestration

- Well-managed regenerative systems can sequester 1-10 tons of carbon per hectare annually
- Deeper soil carbon is more stable and resistant to disturbance
- Potential to offset 5-10% of global emissions if widely adopted

### Reduced Emissions

- Decreased or eliminated synthetic fertilizer use (and associated N₂O emissions)
- Lower fuel consumption from reduced tillage operations
- Decreased methane from improved livestock management

## Climate Adaptation Benefits

Beyond mitigation, regenerative systems build resilience to climate impacts:

### Water Cycle Improvement

- Increased soil organic matter can hold up to 20 times its weight in water
- Improved infiltration reduces flooding during heavy rainfall events
- Better water retention during drought periods

### Temperature Moderation

- Living ground cover reduces soil temperature extremes
- Greater biomass moderates local microclimates
- Reduced heat stress on crops and livestock

### Pest and Disease Resilience

- Diverse systems have natural checks and balances against pest outbreaks
- Healthier plants have improved natural immunity
- Multiple crop species provide risk distribution

## Transitioning to Regenerative Systems

The shift to regenerative practices typically follows a pattern:

1. **Reducing Disturbance**: Minimizing tillage and chemical impacts
2. **Building Diversity**: Introducing cover crops and rotations
3. **Integrating Animals**: Adding managed grazing when appropriate
4. **System Redesign**: Moving toward fully regenerative ecological farming

## Economic Considerations

While transition periods can be challenging, established regenerative farms often report:

- Reduced input costs (up to 70% less in fertilizer and pesticide expenses)
- Comparable or improved yields after the transition period
- Premium pricing opportunities through certification or direct marketing
- Improved stability through diversification

## The Future of Regenerative Agriculture

For regenerative agriculture to scale effectively, several developments are needed:

- **Research Investment**: More long-term studies on carbon sequestration rates and best practices
- **Policy Support**: Payments for ecosystem services and transition assistance
- **Education**: Training programs for farmers on regenerative methods
- **Market Development**: Premium markets recognizing regenerative products

By working with natural processes rather than against them, regenerative agriculture offers a powerful pathway to more resilient food systems and climate stability.
    `,
    imageUrl: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
    publishedAt: {
      seconds: Date.now() / 1000 - 86400 * 6
    },
    categoryId: 'cat-9',
    author: authors[0]
  },
  
  // Cat-10: Health & Climate
  {
    id: 'post-11',
    title: 'Climate Change as a Health Crisis: Current Impacts and Future Risks',
    slug: 'climate-change-health-crisis-impacts-risks',
    excerpt: 'A comprehensive overview of how climate change is already affecting human health and the projected health challenges of a warming world.',
    content: `
# Climate Change as a Health Crisis: Current Impacts and Future Risks

The World Health Organization has described climate change as "the greatest threat to global health in the 21st century." This assessment reflects the extensive and diverse ways in which a changing climate undermines the foundations of public health.

## Direct Health Impacts

### Extreme Heat

As global temperatures rise, heat-related health consequences are becoming more common:

- **Heat Stress**: Conditions like heat exhaustion and potentially fatal heat stroke
- **Cardiovascular Strain**: Increased risk of heart attacks and stroke during extreme heat
- **Renal Impacts**: Higher rates of kidney disease and acute kidney injury
- **Pregnancy Risks**: Preterm birth and other adverse birth outcomes

Research indicates that extreme heat already causes over 5,000 excess deaths annually in the United States alone, with much higher numbers globally.

### Extreme Weather Events

Climate change increases the frequency and intensity of many weather disasters:

- **Hurricanes and Floods**: Immediate trauma, drowning, and long-term mental health impacts
- **Wildfires**: Respiratory damage, burns, and displacement-related health effects
- **Droughts**: Malnutrition, water-borne disease, and resource conflict

These events also disrupt healthcare systems precisely when they're most needed.

## Environmental Mediated Impacts

### Vector-Borne Diseases

Changing temperatures and precipitation patterns affect disease-carrying organisms:

- **Range Expansion**: Mosquitoes, ticks, and other vectors moving into new regions
- **Extended Seasons**: Longer transmission periods in temperate zones
- **Accelerated Development**: Faster pathogen replication in vectors

Diseases like dengue fever, Lyme disease, and potentially malaria are appearing in new regions as a result.

### Air Quality Degradation

Climate change worsens several air quality issues:

- **Ground-Level Ozone**: Formed more readily at higher temperatures
- **Wildfire Smoke**: Increasing frequency and intensity of fires
- **Pollen**: Longer and more intense allergy seasons
- **Particulate Matter**: Changes in atmospheric conditions affecting pollution levels

These changes contribute to asthma, COPD exacerbations, and cardiovascular disease.

### Water and Food Systems

Climate impacts on water and food security have cascading health effects:

- **Water-Borne Diseases**: Increased with flooding and infrastructure damage
- **Food Safety**: Higher temperatures increase food spoilage and contamination risks
- **Nutritional Quality**: CO₂ levels reduce nutrient content in some crops
- **Agricultural Disruption**: Yield declines affecting food security

## Socially Mediated Health Impacts

### Mental Health

Climate change takes a significant psychological toll:

- **Acute Trauma**: Direct psychological impacts of disasters
- **Climate Anxiety**: Chronic stress about environmental degradation
- **Solastalgia**: Distress caused by environmental changes in one's home
- **Community Disruption**: Loss of social cohesion after climate-driven displacement

Young people are particularly vulnerable to climate-related mental health impacts.

### Displacement and Migration

Climate-driven population movement creates health challenges:

- **Refugee Health**: Poor conditions in temporary settlements
- **Interrupted Care**: Disruption of treatment for chronic conditions
- **Infectious Disease**: Transmission in crowded conditions
- **Occupational Hazards**: Risks associated with climate-related migration

By 2050, up to 200 million people could become climate migrants.

## Vulnerability and Justice

Climate health impacts are not distributed equally:

### Vulnerable Populations

- **Children**: Developing bodies more susceptible to environmental hazards
- **Elderly**: Reduced thermoregulatory capacity and higher prevalence of chronic disease
- **Pregnant People**: Vulnerable to heat, air pollution, and nutritional stress
- **Outdoor Workers**: Direct exposure to extreme weather and heat
- **Those with Pre-existing Conditions**: Chronic diseases exacerbated by climate stressors

### Global Health Inequity

- **Geographic Disparity**: Tropical regions facing more severe impacts sooner
- **Resource Inequality**: Limited adaptive capacity in lower-income countries
- **Historical Injustice**: Highest impacts often in regions with lowest historical emissions

## Health System Responses

### Adaptation Measures

Health systems are beginning to implement climate adaptations:

- **Heat Action Plans**: Early warning systems and cooling centers
- **Resilient Infrastructure**: Hospitals designed to withstand extreme weather
- **Surveillance**: Enhanced monitoring of climate-sensitive diseases
- **Workforce Training**: Preparing healthcare providers for emerging challenges

### Mitigation Co-Benefits

Many climate mitigation strategies have immediate health benefits:

- **Active Transportation**: Reduced emissions plus increased physical activity
- **Plant-Rich Diets**: Lower agricultural emissions and improved nutrition
- **Clean Energy**: Reduced air pollution alongside carbon reduction
- **Urban Greening**: Carbon sequestration with mental health and cooling benefits

These "co-benefits" can offset mitigation costs through healthcare savings.

## The Path Forward

Addressing climate change as a health crisis requires:

1. **Health-Centered Climate Policy**: Incorporating health impact assessments in climate decisions
2. **Strengthened Public Health Systems**: Building capacity for climate-related health challenges
3. **Health Professional Advocacy**: Leveraging trusted voices to communicate climate urgency
4. **Research Investment**: Better understanding patterns of vulnerability and effective interventions

The health framing of climate change presents both a stark warning and a powerful motivator for action—protecting human health may be among the most compelling reasons to address the climate crisis with urgency.
    `,
    imageUrl: 'https://images.unsplash.com/photo-1631815588090-d1bcbe9b4b01?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80',
    publishedAt: {
      seconds: Date.now() / 1000 - 86400 * 3
    },
    categoryId: 'cat-10',
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

// Main function to add the new posts
async function addMorePosts() {
  console.log('Starting to add more posts...');
  
  // Upload each additional post
  for (const post of additionalPosts) {
    await uploadDocument('posts', post.id, post);
  }
  
  console.log('Successfully added additional posts!');
}

// Run the operation
addMorePosts().then(() => {
  console.log('Script completed!');
}).catch(error => {
  console.error('Error in script:', error);
}); 