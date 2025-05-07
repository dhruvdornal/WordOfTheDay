// WordService.js
export const getRandomWord = () => {
  return new Promise((resolve) => {
    // Simulate a small delay to make the app feel more realistic (optional)
    setTimeout(() => {
      // You can expand this list for more variety
      const words = [
{
  id: '1',
  word: 'Serendipity',
  definition: 'The occurrence of events by chance in a happy way.',
  example: 'Meeting her was pure serendipity.',
},
{
  id: '2',
  word: 'Eloquent',
  definition: 'Fluent and persuasive in speaking or writing.',
  example: 'She gave an eloquent speech.',
},
{
  id: '3',
  word: 'Ephemeral',
  definition: 'Lasting for a very short time.',
  example: 'Life is as ephemeral as morning dew.',
},
{
  id: '4',
  word: 'Ubiquitous',
  definition: 'Present everywhere.',
  example: 'Mobile phones have become ubiquitous in modern life.',
},
{
  id: '5',
  word: 'Pragmatic',
  definition: 'Dealing sensibly with situations.',
  example: 'He took a pragmatic approach to solving the problem.',
},
{
  id: '6',
  word: 'Algorithm',
  definition: 'A set of rules to solve problems.',
  example: 'The search engine uses a complex algorithm to rank pages.',
},
{
  id: '7',
  word: 'Photosynthesis',
  definition: 'The process by which plants use sunlight to make food.',
  example: 'Photosynthesis is essential for the survival of life on Earth.',
},
{
  id: '8',
  word: 'Sustainability',
  definition: 'Maintaining resources without depleting them.',
  example: 'Sustainability should be the foundation of urban development.',
},
{
  id: '9',
  word: 'Latency',
  definition: 'The delay of the data before data transfer starts.',
  example: 'Low latency is crucial in real-time gaming.',
},
{
  id: '10',
  word: 'Cryptic',
  definition: 'Mysterious or obscure.',
  example: 'His cryptic message left everyone puzzled.',
},
{
  id: '11',
  word: 'Yeet',
  definition: 'To throw something forcefully (slang).',
  example: 'He yeeted the basketball across the court.',
},
{
  id: '12',
  word: 'Quintessential',
  definition: 'The right and perfect example of something.',
  example: 'She is the quintessential professional.',
},
{
  id: '13',
  word: 'Nanotechnology',
  definition: 'Manipulating materials at the atomic or molecular level.',
  example: 'Nanotechnology has promising applications in medicine.',
},
{
  id: '14',
  word: 'Buffer',
  definition: 'Temporary data storage for smooth processing.',
  example: 'The video paused to load more data into the buffer.',
},
{
  id: '15',
  word: 'Aesthetic',
  definition: 'Concerned with beauty or appearance.',
  example: 'Her Instagram feed is very aesthetic.',
},
{
  id: '16',
  word: 'Entropy',
  definition: 'A measure of disorder in a system.',
  example: 'Entropy in the universe is always increasing.',
},
{
  id: '17',
  word: 'Cloud Computing',
  definition: 'Storing and processing data over the internet.',
  example: 'Cloud computing enables scalable and flexible data storage.',
},
{
  id: '18',
  word: 'Woke',
  definition: 'Being socially aware (slang).',
  example: 'He stays woke about social justice issues.',
},
{
  id: '19',
  word: 'Biodegradable',
  definition: 'Able to decompose naturally.',
  example: 'We should switch to biodegradable packaging.',
},
{
  id: '20',
  word: 'Protocol',
  definition: 'A set of rules for data exchange.',
  example: 'HTTP is the protocol used for accessing websites.',
}
];

      // Get a random index, but avoid returning the same word repeatedly
      const index = Math.floor(Math.random() * words.length);
      
      // Add a unique ID if not already present
      const selectedWord = words[index];
      
      resolve(selectedWord);
    }, 500); // Small delay for loading effect
  });
};

// Optionally: Add a function to get a specific word by ID
export const getWordById = (wordId) => {
  const words = [
    // Same word list as above
    // ...
  ];
  
  return words.find(word => word.id === wordId);
};