import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  graduateLevel: {
    type: String,
    enum: ['UG', 'MS', 'PhD'],
  },
  batch: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Hostellite', 'Dayscholar'],
  },
  hostel: {
    type: String,
  },
  transport: {
    pickAndDrop: {
      type: Boolean,
    },
    route: {
      type: String,
    },
  },
  societies: [
    {
      name: {
        type: String,
      },
      designation: {
        type: String,
      },
    },
  ],
});

// studentSchema.pre('save', function (next) {
//   if (this.status === 'Hostellite' && !this.hostel) {
//     next(new Error('Hostel is required when student is hostellite'));
//   }
//   if (
//     this.status === 'Dayscholar' &&
//     this.transport.pickAndDrop &&
//     !this.transport.route
//   ) {
//     next(
//       new Error(
//         'Transport route is required when student uses pick and drop service'
//       )
//     );
//   }
//   next();
// });

export default mongoose.model('Student', studentSchema);
