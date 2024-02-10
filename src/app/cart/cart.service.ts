import { Injectable, computed, effect, signal } from "@angular/core";
import { CartItem } from "./cart";
import { BehaviorSubject, Observable } from "rxjs";
import { Product } from "../products/product";
import { toSignal } from "@angular/core/rxjs-interop";


const CART_DATA = "cart_data";
@Injectable({
  providedIn: 'root'
})
export class CartService {

  private subject = new BehaviorSubject<CartItem[]>([]);

  cartItems$: Observable<CartItem[]> = this.subject.asObservable();

  cartItems = toSignal(this.cartItems$, { initialValue: [] as CartItem[] }) //signal<C

  eLenght = effect(() => console.log("Cart length: ", this.cartItems().length))

  cartCount = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));


  subtotal = computed<number>(() => this.cartItems().reduce((acc, item) => acc + item.quantity * item.product.price, 0));

  deliveryFee = computed<number>(() => this.subtotal() < 50 ? 5.99 : 0);
  tax = computed<number>(() => Math.round(this.subtotal() * 0.1075));


  totalPrice = computed<number>(() => this.subtotal() + this.tax() + this.deliveryFee());

  /**
   *
   */
  constructor() {
    const cart = localStorage.getItem(CART_DATA);

    if (cart)
    {
       this.subject.next(JSON.parse(cart));
    }

  }

  private next(items:CartItem[]) {
    this.subject.next(items);
    localStorage.setItem(CART_DATA, JSON.stringify(items));
  }
  addToCart(product: Product): void {
    var items = this.subject.getValue();
    this.next([...items, { product, quantity: 1 }]);

  }

  updateQuantity(cartItem: CartItem, quantity: number): void {

    var items = this.subject.getValue();
    this.next(items.map(item => item.product.id === cartItem.product.id ? { ...item, quantity } : item));

  }

  removeFromCart(cartItem: CartItem): void {
    var items = this.subject.getValue();
    this.next(items.filter(item => item.product.id !== cartItem.product.id));

  }
}
