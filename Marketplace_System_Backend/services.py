from models import db, User, Seller, Shop, Item, Customer, CartItem
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from datetime import datetime

bcrypt = Bcrypt()

class AuthService:
    @staticmethod
    def register_user(email, password, role):
        if User.query.filter_by(email=email).first():
            raise ValueError("Email already registered")

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        user = User(email=email, password=hashed_password, role=role)
        db.session.add(user)

        if role == 'seller':
            seller = Seller(user=user)
            db.session.add(seller)
        elif role == 'customer':
            customer = Customer(user=user)
            db.session.add(customer)

        db.session.commit()
        return user

    @staticmethod
    def login_user(email, password):
        user = User.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password, password):
            access_token = create_access_token(identity=str(user.id))
            return {
                'token': access_token,
                'user': user
            }
        return None

class SellerService:
    @staticmethod
    def create_shop(seller_id, name, description):
        seller = Seller.query.get(seller_id)
        if not seller:
            raise ValueError("Seller not found")
        
        shop = Shop(seller_id=seller_id, name=name, description=description)
        db.session.add(shop)
        db.session.commit()
        return shop

    @staticmethod
    def add_item(shop_id, name, description, price, stock):
        item = Item(
            shop_id=shop_id,
            name=name,
            description=description,
            price=price,
            stock=stock
        )
        db.session.add(item)
        db.session.commit()
        return item

    @staticmethod
    def update_item(item_id, **kwargs):
        item = Item.query.get(item_id)
        if not item:
            raise ValueError("Item not found")
        
        for key, value in kwargs.items():
            setattr(item, key, value)
        
        db.session.commit()
        return item

    @staticmethod
    def delete_item(item_id):
        item = Item.query.get(item_id)
        if not item:
            raise ValueError("Item not found")
        
        db.session.delete(item)
        db.session.commit()
    
    @staticmethod
    def get_shops(seller_id):
        return Shop.query.filter_by(seller_id=seller_id).all()
    
    @staticmethod
    def get_seller_items(seller_id):
        seller = Seller.query.get(seller_id)
        if not seller:
            raise ValueError("Seller not found")
            
        # Return items grouped by shop
        shop_items = {}
        shops = Shop.query.filter_by(seller_id=seller_id).all()
        for shop in shops:
            shop_items[shop.id] = {
                'shop_name': shop.name,
                'items': shop.items
            }
        return shop_items
    

    @staticmethod
    def delete_shop(seller_id, shop_id):
        seller = Seller.query.get(seller_id)
        if not seller:
            raise ValueError("Seller not found")
        
        shop = Shop.query.get(shop_id)
        if not shop or shop.seller_id != seller_id:
            raise ValueError("Shop not found or unauthorized")
            
        # Delete all items in the shop
        Item.query.filter_by(shop_id=shop.id).delete()
        
        # Delete the shop
        db.session.delete(shop)
        db.session.commit()
        return True
    
class CustomerService:
    @staticmethod
    def add_to_cart(customer_id, item_id, quantity):
        cart_item = CartItem.query.filter_by(
            customer_id=customer_id,
            item_id=item_id
        ).first()
        
        if cart_item:
            cart_item.quantity += quantity
        else:
            cart_item = CartItem(
                customer_id=customer_id,
                item_id=item_id,
                quantity=quantity
            )
            db.session.add(cart_item)
        
        db.session.commit()
        return cart_item

    @staticmethod
    def update_cart_item(customer_id, item_id, quantity):
        cart_item = CartItem.query.filter_by(
            customer_id=customer_id,
            item_id=item_id
        ).first()
        
        if not cart_item:
            raise ValueError("Item not found in cart")
        
        if quantity <= 0:
            db.session.delete(cart_item)
        else:
            cart_item.quantity = quantity
        
        db.session.commit()
        return cart_item

    @staticmethod
    def get_cart(customer_id):
        return CartItem.query.filter_by(customer_id=customer_id).all()
    
    @staticmethod
    def get_all_items():
        return Item.query.all()

    @staticmethod
    def delete_cart_item(customer_id, item_id):
        cart_item = CartItem.query.filter_by(customer_id=customer_id, item_id=item_id).first()
        if not cart_item:
            raise ValueError("Item not found in cart")
        
        db.session.delete(cart_item)
        db.session.commit()
