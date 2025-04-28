import Product from "../models/Product.js"

export const createProduct = async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            discountPercentage,
            category,
            brand,
            thumbnail,
            stockQuantity,
            images,
        } = req.body;

        // Basic validation
        if (!title || !description || !price || !category || !brand || !thumbnail || !stockQuantity || !images?.length) {
            return res.status(400).json({ message: "Please fill all required fields" });
        }

        const newProduct = new Product({
            title,
            description,
            price,
            discountPercentage: discountPercentage || 0,
            category,
            brand,
            thumbnail,
            stockQuantity,
            images,
        });

        const savedProduct = await newProduct.save();

        res.status(201).json({
            message: "Product created successfully",
            product: savedProduct,
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Internal Server Error. Please try again later." });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const filter = {};
        const sort = {};

        // Filtering
        if (req.query.brand) {
            filter.brand = { $in: Array.isArray(req.query.brand) ? req.query.brand : [req.query.brand] };
        }
        if (req.query.category) {
            filter.category = { $in: Array.isArray(req.query.category) ? req.query.category : [req.query.category] };
        }

        // Sorting
        if (req.query.sort) {
            sort[req.query.sort] = req.query.order === 'asc' ? 1 : -1;
        }

        // Pagination (optional but very useful)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const products = await Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('brand', 'name')         // If you want brand name populated
            .populate('category', 'name')       // If you want category name populated
            .exec();

        const total = await Product.countDocuments(filter);

        res.status(200).json({
            total,
            page,
            pages: Math.ceil(total / limit),
            products,
        });

    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: 'Error fetching products, please try again later' });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the ID is a valid MongoDB ObjectId
        if (!id || id.length !== 24) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const product = await Product.findById(id)
            .populate('brand', 'name')       // Populate brand name
            .populate('category', 'name');    // Populate category name

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Error getting product:", error);
        res.status(500).json({ message: 'Error getting product details, please try again later' });
    }
};

export const updateProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!id || id.length !== 24) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: 'Error updating product, please try again later' });
    }
};

export const deleteProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!id || id.length !== 24) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const deletedProduct = await Product.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true, runValidators: true }
        );

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: 'Error deleting product, please try again later' });
    }
};

export const undeleteProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!id || id.length !== 24) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const restoredProduct = await Product.findByIdAndUpdate(
            id,
            { isDeleted: false },
            { new: true, runValidators: true }
        );

        if (!restoredProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product restored successfully", product: restoredProduct });
    } catch (error) {
        console.error("Error restoring product:", error);
        res.status(500).json({ message: 'Error restoring product, please try again later' });
    }
};