import { Injectable, computed, effect, signal } from "@angular/core";
import { CartItem } from "./cart";
import { Observable } from "rxjs";
import { Product } from "../products/product";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>([]);

  eLenght = effect(() => console.log("Cart length: ", this.cartItems().length))

  cartCount = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));


  subtotal = computed<number>(() => this.cartItems().reduce((acc, item) => acc + item.quantity * item.product.price, 0));

  deliveryFee = computed<number>(() => this.subtotal() < 50 ? 5.99 : 0);
  tax = computed<number>(() => Math.round(this.subtotal() * 0.1075));


  totalPrice = computed<number>(() => this.subtotal() + this.tax() + this.deliveryFee());


  addToCart(product: Product): void {
    this.cartItems.update(items => [...items, { product, quantity: 1 }]);

  }

  updateQuantity(cartItem: CartItem, quantity: number): void {
    this.cartItems.update(items => items.map(item => item.product.id === cartItem.product.id ? { ...item, quantity } : item));

  }

  removeFromCart(cartItem: CartItem): void {
    this.cartItems.update(items => items.filter(item => item.product.id !== cartItem.product.id));

  }
}
