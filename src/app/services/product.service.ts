import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://fakestoreapi.com/products';

  constructor(private http: HttpClient) {}

  // Get all products
  getProducts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Get a single product by ID
  getProduct(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`); // Fixed the template literal
  }

  // Add a new product
  addProduct(product: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, product);
  }

  // Update a product
  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, product); // Fixed the template literal
  }

  // Delete a product
  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`); // Fixed the template literal
  }
  getCategories(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/categories`);
  }
  

}
