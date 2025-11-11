import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function NoteDetailScreen({ route, navigation }) {
  const { lectureTitle, lectureDate, folderName } = route.params;
  const [autoTranslate, setAutoTranslate] = useState(false);

  // Hardcoded notes data for different lectures
  const notesData = {
    'Lecture 1': [
      {
        id: 1,
        timestamp: '0:00',
        english: 'The section on keyword optimization and title strategy is the most valuable, especially the word cloud generator technology used to identify industry-specific keywords. Emily Perry elaborated on how to analyze multiple job advertisements and create a word cloud to extract the most commonly used terms, providing a concrete and feasible approach for modifying LinkedIn profiles to meet employers\' expectations. LinkedIn is essentially a search engine used by recruiters, and the fact that titles play a significant role in the search algorithm is particularly enlightening - it has transformed how a person builds a professional image online, from a passive resume to an active marketing tool for promoting a person\'s professional brand.',
        chinese: '关于关键词优化和标题策略的部分最有价值，特别是用于识别行业特定关键词的词云生成器技术。Emily Perry详细解释了如何分析多个招聘启事，并创建一个词云来提取最常用的术语，为修改LinkedIn个人资料以满足雇主的期望提供了一个具体、可行的方法。LinkedIn本质上是招聘人员使用的搜索引擎，而标题在搜索算法中发挥重要作用这一事实特别有启发性 - 它改变了一个人如何在线建立专业形象，从被动的简历到主动推广个人专业品牌的营销工具。'
      },
      {
        id: 2,
        timestamp: '2:15',
        english: 'The discussion about networking strategies and building professional connections was insightful. Understanding how to leverage LinkedIn\'s algorithm to increase visibility and engagement is crucial for career development.',
        chinese: '关于网络策略和建立专业联系的讨论很有见地。了解如何利用LinkedIn的算法来提高可见度和参与度对职业发展至关重要。'
      }
    ],
    'Lecture 2': [
      {
        id: 1,
        timestamp: '0:00',
        english: 'Today\'s lecture focused on data structures and algorithms. We covered binary search trees, their properties, and implementation details. The professor emphasized the importance of understanding time complexity and space complexity when choosing appropriate data structures.',
        chinese: '今天的讲座重点是数据结构和算法。我们讨论了二叉搜索树、它们的属性和实现细节。教授强调了在选择适当的数据结构时理解时间复杂度和空间复杂度的重要性。'
      },
      {
        id: 2,
        timestamp: '1:30',
        english: 'The practical examples of tree traversal methods (in-order, pre-order, and post-order) helped clarify the concepts. We also discussed real-world applications in database indexing and file systems.',
        chinese: '树遍历方法（中序、前序和后序）的实际例子有助于澄清概念。我们还讨论了数据库索引和文件系统中的实际应用。'
      }
    ],
    'Lecture 3': [
      {
        id: 1,
        timestamp: '0:00',
        english: 'Machine learning fundamentals were introduced today. We explored supervised learning, unsupervised learning, and reinforcement learning paradigms. The distinction between classification and regression problems was particularly important.',
        chinese: '今天介绍了机器学习基础知识。我们探讨了监督学习、无监督学习和强化学习范式。分类和回归问题之间的区别特别重要。'
      },
      {
        id: 2,
        timestamp: '1:45',
        english: 'Neural networks and deep learning architectures were discussed in detail. The professor demonstrated how backpropagation works and why gradient descent is essential for training models.',
        chinese: '详细讨论了神经网络和深度学习架构。教授演示了反向传播的工作原理以及为什么梯度下降对训练模型至关重要。'
      }
    ],
    'Lecture 4': [
      {
        id: 1,
        timestamp: '0:00',
        english: 'Software engineering principles and design patterns were the main topics. We learned about SOLID principles, dependency injection, and the importance of writing maintainable code. Code reviews and testing strategies were also emphasized.',
        chinese: '软件工程原则和设计模式是主要话题。我们学习了SOLID原则、依赖注入以及编写可维护代码的重要性。还强调了代码审查和测试策略。'
      },
      {
        id: 2,
        timestamp: '2:00',
        english: 'Agile methodologies and Scrum framework were introduced. The professor explained sprint planning, daily standups, and retrospectives. Understanding team collaboration is crucial for modern software development.',
        chinese: '介绍了敏捷方法论和Scrum框架。教授解释了冲刺规划、每日站会和回顾会议。理解团队协作对现代软件开发至关重要。'
      }
    ],
    'Lecture 5': [
      {
        id: 1,
        timestamp: '0:00',
        english: 'Cloud computing and distributed systems were covered extensively. We discussed microservices architecture, containerization with Docker, and orchestration with Kubernetes. Scalability and fault tolerance are key considerations.',
        chinese: '广泛讨论了云计算和分布式系统。我们讨论了微服务架构、使用Docker的容器化以及使用Kubernetes的编排。可扩展性和容错性是关键考虑因素。'
      },
      {
        id: 2,
        timestamp: '1:50',
        english: 'Database sharding, replication, and consistency models were explained. The CAP theorem and its implications for distributed database design were particularly interesting topics.',
        chinese: '解释了数据库分片、复制和一致性模型。CAP定理及其对分布式数据库设计的影响是特别有趣的话题。'
      }
    ]
  };

  // Get notes for current lecture, default to Lecture 1 if not found
  const currentNotes = notesData[lectureTitle] || notesData['Lecture 1'];

  // Header Component
  const Header = () => (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle1} />
        <View style={styles.logoCircle2} />
        <Text style={styles.logoText}>Otter</Text>
      </View>
      <TouchableOpacity style={styles.userIcon}>
        <MaterialCommunityIcons name="account-circle-outline" size={32} color="#A0A0A0" />
      </TouchableOpacity>
    </View>
  );

  // Auto Translate Toggle
  const AutoTranslateToggle = () => (
    <View style={styles.toggleContainer}>
      <MaterialCommunityIcons name="translate" size={20} color="#E8504C" />
      <Text style={styles.toggleLabel}>Auto Translate</Text>
      <Switch
        value={autoTranslate}
        onValueChange={setAutoTranslate}
        trackColor={{ false: '#D0D0D0', true: '#3B6FE8' }}
        thumbColor={autoTranslate ? '#FFFFFF' : '#F4F3F4'}
        ios_backgroundColor="#D0D0D0"
      />
    </View>
  );

  // Note Entry Component
  const NoteEntry = ({ note }) => (
    <View style={styles.noteEntry}>
      <View style={styles.timestampContainer}>
        <Text style={styles.timestamp}>{note.timestamp}</Text>
        <Text style={styles.speaker}>E : </Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.englishText}>{note.english}</Text>
        {autoTranslate && (
          <Text style={styles.chineseText}>中：{note.chinese}</Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Title */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>NOTE</Text>
          <MaterialCommunityIcons name="pencil" size={32} color="#000" />
        </View>

        {/* Date and Time Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="calendar" size={20} color="#000" />
            <Text style={styles.infoText}>Mon. {lectureDate}</Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#000" />
            <Text style={styles.infoText}>06:38</Text>
          </View>
        </View>

        {/* Tab Section */}
        <View style={styles.tabSection}>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Summary</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, styles.tabActive]}>
            <Text style={[styles.tabText, styles.tabTextActive]}>Transcript</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Note</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Transcript Header with Auto Translate */}
        <View style={styles.transcriptHeader}>
          <Text style={styles.transcriptTitle}>Transcript:</Text>
          <AutoTranslateToggle />
        </View>

        {/* Notes Content */}
        <View style={styles.notesContent}>
          {currentNotes.map((note) => (
            <NoteEntry key={note.id} note={note} />
          ))}
        </View>

        {/* Bottom spacing for navigation bar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F5F5F7',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle1: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B6FE8',
    marginRight: 4,
  },
  logoCircle2: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B6FE8',
    marginRight: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B6FE8',
  },
  userIcon: {
    padding: 4,
  },

  // Title Section
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  pageTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3B6FE8',
    marginRight: 10,
  },

  // Info Section
  infoSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 15,
    gap: 30,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },

  // Tab Section
  tabSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 15,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  tabActive: {
    backgroundColor: '#3B6FE8',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  tabTextActive: {
    color: 'white',
  },

  // Divider
  divider: {
    height: 3,
    backgroundColor: '#999',
    marginHorizontal: 20,
    marginBottom: 15,
  },

  // Transcript Header
  transcriptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  transcriptTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B6FE8',
  },

  // Auto Translate Toggle
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toggleLabel: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },

  // Notes Content
  notesContent: {
    paddingHorizontal: 20,
  },
  noteEntry: {
    marginBottom: 20,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    marginRight: 10,
  },
  speaker: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  textContainer: {
    paddingLeft: 0,
  },
  englishText: {
    fontSize: 15,
    color: '#000',
    lineHeight: 22,
    marginBottom: 8,
  },
  chineseText: {
    fontSize: 14,
    color: '#E8504C',
    lineHeight: 20,
    marginTop: 5,
  },

  // Bottom Spacer
  bottomSpacer: {
    height: 20,
  },
});

