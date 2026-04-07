import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/animated_card.dart';

class PartnerFeedScreen extends StatefulWidget {
  const PartnerFeedScreen({super.key});

  @override
  State<PartnerFeedScreen> createState() => _PartnerFeedScreenState();
}

class _PartnerFeedScreenState extends State<PartnerFeedScreen> {
  String _selectedCategory = "All";
  final List<String> _categories = ["All", "Support", "Science", "Stories", "Tips"];

  final List<Map<String, String>> _feedItems = [
    {
      'type': 'PARTNER TIP',
      'title': 'Supporting Her Luteal Phase 🌙',
      'content': 'Hormones are shifting. Physical comfort and a listening ear are her best friends today. Offer a warm tea or her favorite snack. 🍵',
      'author': 'Luna Support Team',
      'image': 'https://images.unsplash.com/photo-1516534775068-ba3e84529ec1?auto=format&fit=crop&q=80&w=400',
      'icon': '🧸',
      'category': 'Support'
    },
    {
      'type': 'EXPERT ADVICE',
      'title': 'The Science of Connection 🔬',
      'content': 'Did you know partner support during high-stress phases can actually help regulate hormone responses? Here is how to show up.',
      'author': 'Dr. Marcus L.',
      'image': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=400',
      'icon': '🧠',
      'category': 'Science'
    },
    {
      'type': 'STORY',
      'title': 'How We Synced Our Lives ✨',
      'content': "A couple shares how tracking together improved their communication and made their relationship stronger than ever.",
      'author': 'Alex & Sam',
      'image': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=400',
      'icon': '💖',
      'category': 'Stories'
    }
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          color: Color(0xFFFFF5F8),
        ),
        child: CustomScrollView(
          physics: const BouncingScrollPhysics(),
          slivers: [
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(24, 60, 24, 20),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "PARTNER FEED ✨",
                          style: GoogleFonts.outfit(color: const Color(0xFFFF758C), fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.2),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          "Guidance & News",
                          style: GoogleFonts.outfit(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            color: const Color(0xFF2D3142),
                          ),
                        ),
                      ],
                    ),
                    IconButton(icon: const Icon(Icons.search, color: Color(0xFF2D3142)), onPressed: () {}),
                  ],
                ),
              ),
            ),
            SliverToBoxAdapter(
              child: Column(
                children: [
                  _buildCategoryBar(),
                  const SizedBox(height: 10),
                ],
              ),
            ),
            SliverPadding(
              padding: const EdgeInsets.all(16),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final item = _getFilteredItems()[index];
                    return _buildFeedCard(item);
                  },
                  childCount: _getFilteredItems().length,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  List<Map<String, String>> _getFilteredItems() {
    if (_selectedCategory == "All") return _feedItems;
    return _feedItems.where((i) => i['category'] == _selectedCategory).toList();
  }

  Widget _buildCategoryBar() {
    return SizedBox(
      height: 45,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: _categories.length,
        itemBuilder: (context, index) {
          final cat = _categories[index];
          final isSelected = _selectedCategory == cat;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: FilterChip(
              label: Text(cat, style: GoogleFonts.outfit(fontSize: 13, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal)),
              selected: isSelected,
              onSelected: (val) => setState(() => _selectedCategory = cat),
              backgroundColor: Colors.white.withOpacity(0.4),
              selectedColor: const Color(0xFFFF758C).withOpacity(0.2),
              checkmarkColor: const Color(0xFFFF758C),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: BorderSide(color: isSelected ? const Color(0xFFFF758C) : Colors.white.withOpacity(0.5))),
            ),
          );
        },
      ),
    );
  }

  Widget _buildFeedCard(Map<String, String> item) {
    return AnimatedCard(
      padding: EdgeInsets.zero,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
                child: Image.network(item['image']!, height: 200, width: double.infinity, fit: BoxFit.cover),
              ),
              Positioned(
                top: 16,
                right: 16,
                child: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                  child: Text(item['icon']!, style: const TextStyle(fontSize: 16)),
                ),
              ),
            ],
          ),
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(color: const Color(0xFF4DB6AC).withOpacity(0.1), borderRadius: BorderRadius.circular(10)),
                      child: Text(item['type']!, style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.bold, color: const Color(0xFF4DB6AC), letterSpacing: 1.2)),
                    ),
                    Icon(Icons.more_horiz, color: Colors.grey[400]),
                  ],
                ),
                const SizedBox(height: 12),
                Text(item['title']!, style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: const Color(0xFF2D3142), height: 1.2)),
                const SizedBox(height: 10),
                Text(item['content']!, style: GoogleFonts.outfit(fontSize: 14, color: Colors.grey[600], height: 1.5)),
                const SizedBox(height: 20),
                Row(
                  children: [
                    CircleAvatar(radius: 14, backgroundColor: Color(0xFFFFC3A0)[50], child: Text(item['author']![0], style: const TextStyle(fontSize: 12, color: Color(0xFFFFC3A0)))),
                    const SizedBox(width: 10),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(item['author']!, style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.bold, color: const Color(0xFF2D3142))),
                        Text("10 min ago", style: GoogleFonts.outfit(fontSize: 11, color: Colors.grey[400])),
                      ],
                    ),
                    _actionBtn(Icons.share_outlined),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _actionBtn(IconData icon) {
    return Icon(icon, size: 20, color: Colors.grey[400]);
  }
}
