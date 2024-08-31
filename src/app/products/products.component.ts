import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: string[] = [];
  searchId: number | null = null;
  selectedCategory: string = '';
  productForm: FormGroup;
  editForm: FormGroup;
  selectedFile: File | null = null;
  currentProductId: number | null = null;
  isEditModalOpen: boolean = false;
  displayCount: number = 5;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      image: ['']
    });

    this.editForm = this.fb.group({
      title: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      image: ['']
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
        this.updateFilteredProducts();
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  openEditModal(product: any): void {
    this.currentProductId = product.id;
    this.editForm.patchValue({
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image
    });
    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.currentProductId = null;
    this.editForm.reset();
  }

  saveProduct(): void {
    if (this.editForm.valid && this.currentProductId) {
      const updatedProduct = this.editForm.value;
      this.productService.updateProduct(this.currentProductId, updatedProduct).subscribe(
        (response) => {
          const index = this.products.findIndex(product => product.id === this.currentProductId);
          if (index !== -1) {
            this.products[index] = response;
            this.updateFilteredProducts();
          }
          this.closeEditModal();
        },
        (error) => {
          console.error('Error updating product:', error);
        }
      );
    } else {
      console.error('Form is invalid or product ID is missing');
    }
  }

  addProduct(): void {
    if (this.productForm.valid) {
      const formData = new FormData();
      formData.append('title', this.productForm.get('title')?.value);
      formData.append('price', this.productForm.get('price')?.value);
      formData.append('description', this.productForm.get('description')?.value);
      formData.append('category', this.productForm.get('category')?.value);
      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
      }

      this.productService.addProduct(formData).subscribe(
        (response) => {
          this.loadProducts();
          this.productForm.reset();
          this.selectedFile = null;
        },
        (error) => {
          console.error('Error adding product:', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe(
      () => {
        this.products = this.products.filter(product => product.id !== id);
        this.updateFilteredProducts();
      },
      (error) => {
        console.error('Error deleting product:', error);
        this.loadProducts(); // Re-fetch products if deletion fails
      }
    );
  }

  searchProductById(): void {
    if (this.searchId !== null && this.searchId > 0) {
      this.productService.getProduct(this.searchId).subscribe(
        (product) => {
          this.filteredProducts = [product];
        },
        (error) => {
          console.error('Product not found', error);
          this.filteredProducts = [];
        }
      );
    } else {
      this.updateFilteredProducts();
    }
  }

  filterByCategory(): void {
    if (this.selectedCategory) {
      this.filteredProducts = this.products.filter(
        (product) => product.category === this.selectedCategory
      );
    } else {
      this.updateFilteredProducts();
    }
  }

  sortProductsByPrice(order: string): void {
    if (order === 'asc') {
      this.filteredProducts.sort((a, b) => a.price - b.price);
    } else if (order === 'desc') {
      this.filteredProducts.sort((a, b) => b.price - a.price);
    }
  }

// In the component
setDisplayCount(event: Event): void {
  const target = event.target as HTMLSelectElement; // Type assertion
  const count = parseInt(target.value, 10);
  this.displayCount = count;
  this.updateFilteredProducts();
}
  updateFilteredProducts(): void {
    this.filteredProducts = this.products.slice(0, this.displayCount);
  }
}
