import { Prompt } from './types';

export const PROMPTS: Prompt[] = [
  {
    id: 'w1-1',
    type: 'writing1',
    title: 'Global Sales of Digital Media',
    description: 'The chart below shows the global sales of different types of digital media (Music, Video, and Games) between 2018 and 2023. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.',
    wordLimit: 150,
  },
  {
    id: 'w1-2',
    type: 'writing1',
    title: 'Renewable Energy Consumption',
    description: 'The pie chart shows the proportion of energy consumed from different renewable sources in a European country in 2022. Summarize the information by selecting and reporting the main features.',
    wordLimit: 150,
  },
  {
    id: 'w2-1',
    type: 'writing2',
    title: 'Technology in Education',
    description: 'Some people believe that the use of technology in schools has a positive impact on students\' learning, while others argue that it can be a distraction. Discuss both views and give your own opinion.',
    wordLimit: 250,
  },
  {
    id: 'w2-2',
    type: 'writing2',
    title: 'Environmental Responsibility',
    description: 'Many people think that governments should take the lead in protecting the environment, while others believe that individuals should take more responsibility. Discuss both views and give your opinion.',
    wordLimit: 250,
  },
  {
    id: 'r-1',
    type: 'reading',
    title: 'The History of the Printing Press',
    passage: 'The printing press, invented by Johannes Gutenberg in the mid-15th century, was one of the most influential inventions in human history. Before its invention, books were copied by hand, a process that was slow and expensive. The printing press allowed for the mass production of books, making knowledge more accessible to the general public. This led to an increase in literacy rates and played a crucial role in the Renaissance and the Scientific Revolution. By the 16th century, printing presses were established in major cities across Europe, producing millions of books on various subjects.',
    questions: [
      { id: 'r1q1', text: 'Who invented the printing press?', answer: 'Johannes Gutenberg' },
      { id: 'r1q2', text: 'What was the main benefit of the printing press?', answer: 'mass production of books' },
      { id: 'r1q3', text: 'Which historical period did the printing press influence?', answer: 'Renaissance' },
    ],
    description: 'Read the passage and answer the following questions based on the text.',
  },
  {
    id: 'r-2',
    type: 'reading',
    title: 'Marine Biodiversity',
    passage: 'Marine biodiversity refers to the variety of life forms in the ocean, from microscopic plankton to giant whales. Oceans cover more than 70% of the Earth\'s surface and are home to a vast array of species. However, marine ecosystems are currently facing numerous threats, including overfishing, pollution, and climate change. Coral reefs, often called the "rainforests of the sea," are particularly vulnerable. Protecting marine biodiversity is essential for maintaining the health of our planet and ensuring the sustainability of resources that millions of people depend on.',
    questions: [
      { id: 'r2q1', text: 'What percentage of the Earth\'s surface is covered by oceans?', answer: '70%' },
      { id: 'r2q2', text: 'What are coral reefs often called?', answer: 'rainforests of the sea' },
      { id: 'r2q3', text: 'Name one threat to marine ecosystems mentioned in the text.', answer: 'overfishing' },
    ],
    description: 'Read the passage and answer the following questions based on the text.',
  },
  {
    id: 's-1',
    type: 'speaking',
    title: 'Daily Routine',
    description: 'Part 1: Let\'s talk about your daily routine. What do you usually do in the morning? Do you prefer working in the morning or in the evening? Part 2: Describe a typical day in your life when you were a child. You should say: what you did, who you were with, and explain why you remember it so well.',
  },
  {
    id: 's-2',
    type: 'speaking',
    title: 'A Memorable Journey',
    description: 'Part 1: Do you like traveling? What is your favorite mode of transport? Part 2: Describe a memorable journey you have taken. You should say: where you went, how you traveled, who you were with, and explain why it was so memorable.',
  },
];
