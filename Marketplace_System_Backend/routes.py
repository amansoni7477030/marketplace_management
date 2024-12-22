from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services import AuthService, SellerService, CustomerService
from models import User, Seller, Customer, Shop, Item

api = Blueprint('api', __name__)

# Auth routes
@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    try:
        user = AuthService.register_user(
            email=data['email'],
            password=data['password'],
            role=data['role']
        )
        return jsonify({
            "message": "Registration successful",
            "user": {
                "email": user.email,
                "role": user.role
            }
        }), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    result = AuthService.login_user(
        email=data['email'],
        password=data['password']
    )
    if result:
        return jsonify({
            "token": result['token'],
            "user": {
                "email": result['user'].email,
                "role": result['user'].role
            }
        }), 200
    return jsonify({"error": "Invalid credentials"}), 401

@api.route('/user/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({
        "email": user.email,
        "role": user.role,
        "created_at": user.created_at.isoformat()
    }), 200

# Add missing shop and item endpoints
@api.route('/shops', methods=['GET'])
@jwt_required()
def get_shops():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or user.role != 'seller':
        return jsonify({"error": "Unauthorized"}), 403
        
    shops = SellerService.get_shops(user.seller_profile.id)
    return jsonify([{
        "id": shop.id,
        "name": shop.name,
        "description": shop.description
    } for shop in shops]), 200

@api.route('/items', methods=['GET'])
def get_all_items():
    items = CustomerService.get_all_items()
    return jsonify([{
        "id": item.id,
        "name": item.name,
        "description": item.description,
        "price": item.price,
        "stock": item.stock,
        "shop_name": item.shop.name
    } for item in items]), 200

# Seller routes
@api.route('/shops', methods=['POST'])
@jwt_required()
def create_shop():
    user_id = get_jwt_identity()
    print(f"User ID: {user_id}")  # Log the user ID
    user = User.query.get(user_id)

    if not user or user.role != 'seller':
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    print(f"Request Data: {data}")  # Log the request data
    if not data or 'name' not in data:
        return jsonify({"error": "Invalid data"}), 422

    shop = SellerService.create_shop(
        seller_id=user.seller_profile.id,
        name=data['name'],
        description=data.get('description', '')
    )
    return jsonify({
        "id": shop.id,
        "name": shop.name,
        "description": shop.description
    }), 201

@api.route('/shops/<int:shop_id>/items', methods=['POST'])
@jwt_required()
def add_item(shop_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role != 'seller':
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    print(f"Request Data: {data}")  # Log the request data
    try:
        item = SellerService.add_item(
            shop_id=shop_id,
            name=data['name'],
            description=data.get('description', ''),
            price=data['price'],
            stock=data['stock']
        )
        return jsonify({
            "id": item.id,
            "name": item.name,
            "price": item.price,
            "stock": item.stock
        }), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

# Customer routes
@api.route('/cart/items', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role != 'customer':
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    print(f"Request Data: {data}")  # Log the request data
    try:
        cart_item = CustomerService.add_to_cart(
            customer_id=user.customer_profile.id,
            item_id=data['item_id'],
            quantity=data['quantity']
        )
        return jsonify({
            "item_id": cart_item.item_id,
            "quantity": cart_item.quantity
        }), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

@api.route('/cart/items/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_cart_item(item_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role != 'customer':
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    print(f"Request Data: {data}")  # Log the request data
    try:
        cart_item = CustomerService.update_cart_item(
            customer_id=user.customer_profile.id,
            item_id=item_id,
            quantity=data['quantity']
        )
        return jsonify({
            "item_id": cart_item.item_id,
            "quantity": cart_item.quantity
        }), 200 if cart_item else 204
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

@api.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role != 'customer':
        return jsonify({"error": "Unauthorized"}), 403

    cart_items = CustomerService.get_cart(user.customer_profile.id)
    return jsonify([{
        "item_id": item.item_id,
        "quantity": item.quantity,
        "item_name": item.item.name,
        "price": item.item.price
    } for item in cart_items]), 200

@api.route('/seller/items', methods=['GET'])
@jwt_required()
def get_seller_items():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role != 'seller':
        return jsonify({"error": "Unauthorized"}), 403

    try:
        items = SellerService.get_seller_items(user.seller_profile.id)
        return jsonify([{
            "id": item.id,
            "name": item.name,
            "description": item.description,
            "price": item.price,
            "stock": item.stock,
            "shop_name": item.shop.name  # Get the shop name through the relationship
        } for item in items]), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

@api.route('/items/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_item(item_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role != 'seller':
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    try:
        item = SellerService.update_item(item_id, **data)
        return jsonify({
            "id": item.id,
            "name": item.name,
            "description": item.description,
            "price": item.price,
            "stock": item.stock
        }), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

@api.route('/shops/<int:shop_id>/items', methods=['GET'])
@jwt_required()
def get_shop_items(shop_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role != 'seller':
        return jsonify({"error": "Unauthorized"}), 403

    shop = Shop.query.get(shop_id)
    if not shop or shop.seller_id != user.seller_profile.id:
        return jsonify({"error": "Shop not found or unauthorized"}), 404

    items = shop.items  # Assuming a relationship exists between Shop and Item
    return jsonify([{
        "id": item.id,
        "name": item.name,
        "description": item.description,
        "price": item.price,
        "stock": item.stock
    } for item in items]), 200

@api.route('/cart/items/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_cart_item(item_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role != 'customer':
        return jsonify({"error": "Unauthorized"}), 403

    try:
        # Call the CustomerService to remove the item from the cart
        CustomerService.delete_cart_item(user.customer_profile.id, item_id)
        return jsonify({"message": "Item removed from cart"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

@api.route('/shops/<int:shop_id>', methods=['DELETE'])
@jwt_required()
def delete_shop(shop_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role != 'seller':
        return jsonify({"error": "Unauthorized"}), 403

    try:
        SellerService.delete_shop(user.seller_profile.id, shop_id)
        return jsonify({"message": "Shop deleted successfully"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

@api.route('/items/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_item(item_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or user.role != 'seller':
        return jsonify({"error": "Unauthorized"}), 403

    try:
        SellerService.delete_item(item_id)
        return jsonify({"message": "Item deleted successfully"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400