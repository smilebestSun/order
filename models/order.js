'use strict';

import mongoose from 'mongoose';
import uid from 'uid';
import idValidator from 'mongoose-id-validator';

const orderDetailSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  productId: {
    type: String,
    required: true
  },
  productName: String,
  price: {
    type: Number,
    required: true
  },
  count: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  details: [orderDetailSchema],
  description: String
}, {
  versionKey: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  toJSON: {
    transform(doc, ret) {
      delete ret._id;
      delete ret.hashed_secret;
    },
  },
});

orderSchema.virtual('total').get(function() {
  var total = 0;
  var details = this.details;

  if (details) {
    details.map(item => {
      return item.price * item.count;
    }).reduce((pre, cur) => {
      return pre + cur;
    }, total);
  }

  return total;
});

orderSchema.plugin(idValidator);

orderSchema.pre('validate', function preSave(next) {
  if (this.isNew) {
    if (!this.id) {
      this.id = uid(16);
    }
  }
  next();
});

export default mongoose.model('Order', orderSchema);