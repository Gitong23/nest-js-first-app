import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Model } from 'mongoose';
import { ProductsService } from 'src/products/products.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private productsService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const productResult = await this.productsService.findOne(
      createOrderDto.productId,
    );
    if (!productResult) {
      throw new NotFoundException('Product not found');
    }

    const result = new this.orderModel(createOrderDto);
    return result.save();
  }

  async findOne(id: string): Promise<Order> {
    const order = this.orderModel.findById(id).populate('productId').exec();
    return order;
  }
}
