const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint //
// Finds all categories and includes its associated Products //

router.get('/', (req, res) => {
  Category.findAll({
    include: {
      model: Product,
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
    }
  })
    .then(dbCatData => {
      if (!dbCatData) {
        res.status(404).json({ message: 'No categories found' });
        return;
      }
      res.json(dbCatData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err)
    });
});

// Finds one category by its `id` value and includes its associated Products //

router.get('/:id', (req, res) => {
  Category.findOne({
    where: {
      id: req.params.id
    },
    include: {
      model: Product,
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
    }
  })
    .then(dbCatData => {
      if (!dbCatData) {
        res.status(404).json({ message: 'No categories found' });
        return;
      }
      res.json(dbCatData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err)
    });
});

// Creates a new category //
router.post('/', async (req, res) => {

  // Console.log in order to debug if needed //
  console.log(req.body);
  const { category_name } = req.body;
  if (!category_name) {
    return res.status(400).json({ error: "Category name invalid" });
  }
  try {
    const newData = await Category.create({
      category_name,
    });
    res.status(200).json(newData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Updates a category by its 'id' value //
router.put('/:id', async (req, res) => {
  try {
    const updatedCategory = await Category.update(
      {
        category_name: req.body.category_name
      },
      {
        where: {
          id: req.params.id
        }
      }
    );
    res.status(200).json(updatedCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Deletes a category by its 'id' value //
router.delete('/:id', async (req, res) => {
  try {
    const deletedCategory = await Category.destroy({
      where: {
        id: req.params.id
      }
    });
    if (deletedCategory === 0) {
      return res.status(404).json({ message: 'Cannot locate category' });
    }
    res.status(200).json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;