const OpenAI = require('openai');
require('dotenv').config();
const PurchaseRequest = require('../models/PurchaseRequest');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a helpful assistant for the Warehouse – Intelligent Supply Chain Management System. This platform manages inventory, suppliers, purchase requests, analytics, and user roles (employee, supplier, admin) for rural institutions. Answer all questions in the context of this platform, including how to use features, roles, and best practices.`;

const faqs = [
  { q: /how.*request/i, a: "To request a product, go to the Products tab and click 'Request'." },
  { q: /how.*rate/i, a: "You can rate a product after your purchase is approved, from the Requests tab." },
  { q: /supplier.*approval/i, a: "Suppliers must be approved by an admin before selling. Admins can approve suppliers in the 'Supplier Approvals' tab." },
  { q: /how.*register/i, a: "Click Register, fill in your details, and select your role. Suppliers require admin approval before they can sell." },
  { q: /how.*see.*status/i, a: "Go to the Requests tab to see the status of your purchase requests. Admins can see all requests in the 'Purchase Requests' tab." },
  { q: /how.*add.*product/i, a: "Suppliers can add products from the Products tab using the Add Product form." },
  { q: /how.*contact.*admin/i, a: "Please use the chat or contact support for admin assistance." },
  { q: /what.*can.*employee/i, a: "Employees can view products, request products, track their requests, and rate products after purchase." },
  { q: /what.*can.*supplier/i, a: "Suppliers can add/manage products, see and approve/reject requests for their products, and view analytics." },
  { q: /what.*can.*admin/i, a: "Admins can view all products, all requests, approve suppliers, and see analytics. Admins cannot approve/reject product requests." },
  { q: /what.*platform|what.*system|what.*this/i, a: "This is the Warehouse – Intelligent Supply Chain Management System. It helps manage inventory, suppliers, requests, analytics, and more for rural institutions." },
];

exports.chat = async (req, res) => {
  const { message } = req.body;
  const userId = req.user?.id || req.user?._id;

  // User-specific queries
  if (/total.*quantity.*order/i.test(message)) {
    if (!userId) return res.json({ answer: 'Please log in to get your order details.' });
    const total = await PurchaseRequest.aggregate([
      { $match: { requestedBy: userId, status: { $in: ['approved', 'pending'] } } },
      { $group: { _id: null, total: { $sum: '$quantity' } } }
    ]);
    return res.json({ answer: `You have ordered a total quantity of ${total[0]?.total || 0}.` });
  }
  if (/pending.*request/i.test(message)) {
    if (!userId) return res.json({ answer: 'Please log in to get your pending requests.' });
    const pending = await PurchaseRequest.find({ requestedBy: userId, status: 'pending' }).populate('product', 'name');
    if (pending.length === 0) return res.json({ answer: 'You have no pending requests.' });
    return res.json({ answer: `Your pending requests: ` + pending.map(r => `${r.product?.name || 'Product'} (Qty: ${r.quantity})`).join(', ') });
  }

  // General queries: use OpenAI, fallback to static FAQ
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message }
      ],
      max_tokens: 300
    });
    res.json({ answer: completion.choices[0].message.content });
  } catch (err) {
    // Fallback to static FAQ
    const found = faqs.find(f => f.q.test(message));
    res.json({ answer: found ? found.a : "Sorry, I'm unable to answer your question right now. Please contact support or try rephrasing your question." });
  }
};
