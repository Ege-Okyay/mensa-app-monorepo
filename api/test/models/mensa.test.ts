import { expect, test } from 'bun:test';
import { MenuDataSchema } from '../../src/models/mensa';

test('MenuDataSchema rejects incomplete translations', () => {
  const invalid = {
    mensa_name: 'Test',
    first_courses: [{
      it: { name: 'Pasta', description: '' },
      allergens: [],
      dietary_category: 'Vegan'
    }],
    main_courses: [],
    side_dishes: [],
    specialties_available: false,
    common_allergens: []
  };

  const result = MenuDataSchema.safeParse(invalid);
  expect(result.success).toBe(false);
});

test('MenuDataSchema rejects invalid dietary types', () => {
  const data = {
    mensa_name: 'Test',
    first_courses: [{
      it: { name: 'Pasta', description: '' },
      en: { name: 'Pasta', description: '' },
      tr: { name: 'Pasta', description: '' },
      allergens: [],
      dietary_category: 'Test'
    }],
  };

  const result = MenuDataSchema.safeParse(data)
  expect(result.success).toBe(false);
});
