export interface Book {
  title: string
  originalTitle?: string
  author: string
}

export const books: Book[] = [
  { title: 'Churchill: Walking with Destiny', author: 'Andrew Roberts' },
  { title: 'Destiny Disrupted: A History of the World Through Islamic Eyes', author: 'Tamim Ansary' },
  { title: 'The Innovators', author: 'Walter Isaacson' },
  { title: 'Elon Musk', author: 'Walter Isaacson' },
  { title: 'Einstein', author: 'Walter Isaacson' },
  { title: 'Steve Jobs', author: 'Walter Isaacson' },
  { title: 'Conflict', author: 'David Petraeus' },
  { title: 'Shoe Dog', author: 'Phil Knight' },
  { title: 'A Random Walk Down Wall Street', author: 'Burton G. Malkiel' },
  { title: 'Reluctant Pioneer', author: 'Thomas Osborne' },
  { title: 'Les Rois Maudits', originalTitle: 'The Accursed Kings', author: 'Maurice Druon' },
  { title: 'Le Comte de Monte-Cristo', originalTitle: 'The Count of Monte Cristo', author: 'Alexandre Dumas' },
  { title: "Ma Bataille d'Alger", originalTitle: 'My Battle of Algiers', author: 'Ted Morgan' },
  { title: 'Zero to One', author: 'Peter Thiel' },
  { title: 'Le Chant du Départ', author: 'Max Gallo' },
  { title: 'Forgotten Voices of the Great War', author: 'Max Arthur' },
  { title: 'Persian Fire', author: 'Tom Holland' },
  { title: 'Rubicon', author: 'Tom Holland' },
  { title: 'The Reckoning', author: 'Jacob Soll' },
  { title: 'A Promised Land', author: 'Barack Obama' },
  { title: 'La Prochaine Peste', originalTitle: 'The Next Plague', author: 'Serge Morand' },
  { title: 'Collapse', author: 'Jared Diamond' },
]
