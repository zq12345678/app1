import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRecording } from '../contexts/RecordingContext';

export default function NoteDetailScreen({ route, navigation }) {
  const { lectureTitle, lectureDate, folderName } = route.params;
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('simplifiedChinese');
  const [activeTab, setActiveTab] = useState('Transcript'); // 'Summary', 'Transcript', or 'Note'
  const { registerHandler, unregisterHandler, isProcessing } = useRecording();

  // Update selected language when returning from LanguageSelectionScreen
  React.useEffect(() => {
    if (route.params?.selectedLanguage) {
      setSelectedLanguage(route.params.selectedLanguage);
    }
  }, [route.params?.selectedLanguage]);

  // Hardcoded notes data for different lectures
  const notesData = {
    'Lecture 1': [
      {
        id: 1,
        timestamp: '0:00',
        english: 'The section on keyword optimization and title strategy is the most valuable, especially the word cloud generator technology used to identify industry-specific keywords. Emily Perry elaborated on how to analyze multiple job advertisements and create a word cloud to extract the most commonly used terms, providing a concrete and feasible approach for modifying LinkedIn profiles to meet employers\' expectations. LinkedIn is essentially a search engine used by recruiters, and the fact that titles play a significant role in the search algorithm is particularly enlightening - it has transformed how a person builds a professional image online, from a passive resume to an active marketing tool for promoting a person\'s professional brand.',
        simplifiedChinese: '关于关键词优化和标题策略的部分最有价值，特别是用于识别行业特定关键词的词云生成器技术。Emily Perry详细解释了如何分析多个招聘启事，并创建一个词云来提取最常用的术语，为修改LinkedIn个人资料以满足雇主的期望提供了一个具体、可行的方法。LinkedIn本质上是招聘人员使用的搜索引擎，而标题在搜索算法中发挥重要作用这一事实特别有启发性 - 它改变了一个人如何在线建立专业形象，从被动的简历到主动推广个人专业品牌的营销工具。',
        traditionalChinese: '關於關鍵詞優化和標題策略的部分最有價值，特別是用於識別行業特定關鍵詞的詞雲生成器技術。Emily Perry詳細解釋了如何分析多個招聘啟事，並創建一個詞雲來提取最常用的術語，為修改LinkedIn個人資料以滿足雇主的期望提供了一個具體、可行的方法。LinkedIn本質上是招聘人員使用的搜索引擎，而標題在搜索算法中發揮重要作用這一事實特別有啟發性 - 它改變了一個人如何在線建立專業形象，從被動的簡歷到主動推廣個人專業品牌的營銷工具。',
        italian: 'La sezione sull\'ottimizzazione delle parole chiave e sulla strategia del titolo è la più preziosa, in particolare la tecnologia del generatore di nuvole di parole utilizzata per identificare parole chiave specifiche del settore. Emily Perry ha spiegato come analizzare più annunci di lavoro e creare una nuvola di parole per estrarre i termini più comunemente usati, fornendo un approccio concreto e fattibile per modificare i profili LinkedIn per soddisfare le aspettative dei datori di lavoro. LinkedIn è essenzialmente un motore di ricerca utilizzato dai reclutatori, e il fatto che i titoli svolgano un ruolo significativo nell\'algoritmo di ricerca è particolarmente illuminante - ha trasformato il modo in cui una persona costruisce un\'immagine professionale online, da un curriculum passivo a uno strumento di marketing attivo per promuovere il marchio professionale di una persona.',
        spanish: 'La sección sobre optimización de palabras clave y estrategia de títulos es la más valiosa, especialmente la tecnología del generador de nubes de palabras utilizada para identificar palabras clave específicas de la industria. Emily Perry explicó cómo analizar múltiples anuncios de trabajo y crear una nube de palabras para extraer los términos más utilizados, proporcionando un enfoque concreto y factible para modificar los perfiles de LinkedIn para cumplir con las expectativas de los empleadores. LinkedIn es esencialmente un motor de búsqueda utilizado por los reclutadores, y el hecho de que los títulos jueguen un papel importante en el algoritmo de búsqueda es particularmente esclarecedor: ha transformado cómo una persona construye una imagen profesional en línea, de un currículum pasivo a una herramienta de marketing activa para promover la marca profesional de una persona.',
        japanese: 'キーワード最適化とタイトル戦略に関するセクションが最も価値があり、特に業界固有のキーワードを識別するために使用されるワードクラウドジェネレーター技術が重要です。Emily Perryは、複数の求人広告を分析し、最も一般的に使用される用語を抽出するためのワードクラウドを作成する方法について詳しく説明し、雇用主の期待に応えるためにLinkedInプロフィールを変更するための具体的で実行可能なアプローチを提供しました。LinkedInは本質的にリクルーターが使用する検索エンジンであり、タイトルが検索アルゴリズムで重要な役割を果たすという事実は特に啓発的です - それは、受動的な履歴書から個人の専門的なブランドを宣伝するための積極的なマーケティングツールへと、人がオンラインで専門的なイメージを構築する方法を変革しました。',
        korean: '키워드 최적화 및 제목 전략에 관한 섹션이 가장 가치 있으며, 특히 산업별 키워드를 식별하는 데 사용되는 워드 클라우드 생성기 기술이 중요합니다. Emily Perry는 여러 채용 공고를 분석하고 가장 일반적으로 사용되는 용어를 추출하기 위해 워드 클라우드를 만드는 방법에 대해 자세히 설명했으며, 고용주의 기대를 충족시키기 위해 LinkedIn 프로필을 수정하는 구체적이고 실행 가능한 접근 방식을 제공했습니다. LinkedIn은 본질적으로 채용 담당자가 사용하는 검색 엔진이며, 제목이 검색 알고리즘에서 중요한 역할을 한다는 사실은 특히 계몽적입니다 - 이는 사람이 온라인에서 전문적인 이미지를 구축하는 방법을 수동적인 이력서에서 개인의 전문 브랜드를 홍보하기 위한 적극적인 마케팅 도구로 변화시켰습니다.'
      },
      {
        id: 2,
        timestamp: '2:15',
        english: 'The discussion about networking strategies and building professional connections was insightful. Understanding how to leverage LinkedIn\'s algorithm to increase visibility and engagement is crucial for career development.',
        simplifiedChinese: '关于网络策略和建立专业联系的讨论很有见地。了解如何利用LinkedIn的算法来提高可见度和参与度对职业发展至关重要。',
        traditionalChinese: '關於網絡策略和建立專業聯繫的討論很有見地。了解如何利用LinkedIn的算法來提高可見度和參與度對職業發展至關重要。',
        italian: 'La discussione sulle strategie di networking e sulla costruzione di connessioni professionali è stata perspicace. Comprendere come sfruttare l\'algoritmo di LinkedIn per aumentare la visibilità e il coinvolgimento è cruciale per lo sviluppo della carriera.',
        spanish: 'La discusión sobre estrategias de networking y construcción de conexiones profesionales fue perspicaz. Comprender cómo aprovechar el algoritmo de LinkedIn para aumentar la visibilidad y el compromiso es crucial para el desarrollo profesional.',
        japanese: 'ネットワーキング戦略と専門的なつながりの構築に関する議論は洞察に富んでいました。可視性とエンゲージメントを高めるためにLinkedInのアルゴリズムを活用する方法を理解することは、キャリア開発にとって重要です。',
        korean: '네트워킹 전략 및 전문적인 연결 구축에 대한 토론은 통찰력이 있었습니다. 가시성과 참여를 높이기 위해 LinkedIn의 알고리즘을 활용하는 방법을 이해하는 것은 경력 개발에 중요합니다.'
      }
    ],
    'Lecture 2': [
      {
        id: 1,
        timestamp: '0:00',
        english: 'Today\'s lecture focused on data structures and algorithms. We covered binary search trees, their properties, and implementation details. The professor emphasized the importance of understanding time complexity and space complexity when choosing appropriate data structures.',
        simplifiedChinese: '今天的讲座重点是数据结构和算法。我们讨论了二叉搜索树、它们的属性和实现细节。教授强调了在选择适当的数据结构时理解时间复杂度和空间复杂度的重要性。',
        traditionalChinese: '今天的講座重點是數據結構和算法。我們討論了二叉搜索樹、它們的屬性和實現細節。教授強調了在選擇適當的數據結構時理解時間複雜度和空間複雜度的重要性。',
        italian: 'La lezione di oggi si è concentrata su strutture dati e algoritmi. Abbiamo trattato gli alberi di ricerca binari, le loro proprietà e i dettagli di implementazione. Il professore ha sottolineato l\'importanza di comprendere la complessità temporale e la complessità spaziale quando si scelgono strutture dati appropriate.',
        spanish: 'La conferencia de hoy se centró en estructuras de datos y algoritmos. Cubrimos árboles de búsqueda binarios, sus propiedades y detalles de implementación. El profesor enfatizó la importancia de comprender la complejidad temporal y la complejidad espacial al elegir estructuras de datos apropiadas.',
        japanese: '今日の講義はデータ構造とアルゴリズムに焦点を当てました。二分探索木、そのプロパティ、実装の詳細について説明しました。教授は、適切なデータ構造を選択する際に時間計算量と空間計算量を理解することの重要性を強調しました。',
        korean: '오늘 강의는 데이터 구조와 알고리즘에 초점을 맞췄습니다. 이진 검색 트리, 그 속성 및 구현 세부 사항을 다루었습니다. 교수는 적절한 데이터 구조를 선택할 때 시간 복잡도와 공간 복잡도를 이해하는 것의 중요성을 강조했습니다.'
      },
      {
        id: 2,
        timestamp: '1:30',
        english: 'The practical examples of tree traversal methods (in-order, pre-order, and post-order) helped clarify the concepts. We also discussed real-world applications in database indexing and file systems.',
        simplifiedChinese: '树遍历方法（中序、前序和后序）的实际例子有助于澄清概念。我们还讨论了数据库索引和文件系统中的实际应用。',
        traditionalChinese: '樹遍歷方法（中序、前序和後序）的實際例子有助於澄清概念。我們還討論了數據庫索引和文件系統中的實際應用。',
        italian: 'Gli esempi pratici dei metodi di attraversamento degli alberi (in-order, pre-order e post-order) hanno aiutato a chiarire i concetti. Abbiamo anche discusso applicazioni del mondo reale nell\'indicizzazione dei database e nei file system.',
        spanish: 'Los ejemplos prácticos de métodos de recorrido de árboles (in-order, pre-order y post-order) ayudaron a aclarar los conceptos. También discutimos aplicaciones del mundo real en indexación de bases de datos y sistemas de archivos.',
        japanese: 'ツリートラバーサル方法（中順、前順、後順）の実用的な例は、概念を明確にするのに役立ちました。また、データベースインデックスとファイルシステムでの実際のアプリケーションについても議論しました。',
        korean: '트리 순회 방법(중위, 전위, 후위)의 실용적인 예는 개념을 명확히 하는 데 도움이 되었습니다. 또한 데이터베이스 인덱싱 및 파일 시스템의 실제 응용 프로그램에 대해서도 논의했습니다.'
      }
    ],
    'Lecture 3': [
      {
        id: 1,
        timestamp: '0:00',
        english: 'Machine learning fundamentals were introduced today. We explored supervised learning, unsupervised learning, and reinforcement learning paradigms. The distinction between classification and regression problems was particularly important.',
        simplifiedChinese: '今天介绍了机器学习基础知识。我们探讨了监督学习、无监督学习和强化学习范式。分类和回归问题之间的区别特别重要。',
        traditionalChinese: '今天介紹了機器學習基礎知識。我們探討了監督學習、無監督學習和強化學習範式。分類和回歸問題之間的區別特別重要。',
        italian: 'Oggi sono stati introdotti i fondamenti del machine learning. Abbiamo esplorato i paradigmi di apprendimento supervisionato, non supervisionato e per rinforzo. La distinzione tra problemi di classificazione e regressione era particolarmente importante.',
        spanish: 'Hoy se introdujeron los fundamentos del aprendizaje automático. Exploramos paradigmas de aprendizaje supervisado, no supervisado y por refuerzo. La distinción entre problemas de clasificación y regresión fue particularmente importante.',
        japanese: '今日は機械学習の基礎が紹介されました。教師あり学習、教師なし学習、強化学習のパラダイムを探求しました。分類問題と回帰問題の区別が特に重要でした。',
        korean: '오늘은 기계 학습의 기초가 소개되었습니다. 지도 학습, 비지도 학습 및 강화 학습 패러다임을 탐구했습니다. 분류 문제와 회귀 문제 간의 구별이 특히 중요했습니다.'
      },
      {
        id: 2,
        timestamp: '1:45',
        english: 'Neural networks and deep learning architectures were discussed in detail. The professor demonstrated how backpropagation works and why gradient descent is essential for training models.',
        simplifiedChinese: '详细讨论了神经网络和深度学习架构。教授演示了反向传播的工作原理以及为什么梯度下降对训练模型至关重要。',
        traditionalChinese: '詳細討論了神經網絡和深度學習架構。教授演示了反向傳播的工作原理以及為什麼梯度下降對訓練模型至關重要。',
        italian: 'Le reti neurali e le architetture di deep learning sono state discusse in dettaglio. Il professore ha dimostrato come funziona la backpropagation e perché la discesa del gradiente è essenziale per l\'addestramento dei modelli.',
        spanish: 'Las redes neuronales y las arquitecturas de aprendizaje profundo se discutieron en detalle. El profesor demostró cómo funciona la retropropagación y por qué el descenso de gradiente es esencial para entrenar modelos.',
        japanese: 'ニューラルネットワークとディープラーニングアーキテクチャについて詳しく議論しました。教授は、バックプロパゲーションがどのように機能するか、そしてなぜ勾配降下法がモデルのトレーニングに不可欠であるかを実演しました。',
        korean: '신경망과 딥러닝 아키텍처에 대해 자세히 논의했습니다. 교수는 역전파가 어떻게 작동하는지, 그리고 경사 하강법이 모델 훈련에 왜 필수적인지 시연했습니다.'
      }
    ],
    'Lecture 4': [
      {
        id: 1,
        timestamp: '0:00',
        english: 'Software engineering principles and design patterns were the main topics. We learned about SOLID principles, dependency injection, and the importance of writing maintainable code. Code reviews and testing strategies were also emphasized.',
        simplifiedChinese: '软件工程原则和设计模式是主要话题。我们学习了SOLID原则、依赖注入以及编写可维护代码的重要性。还强调了代码审查和测试策略。',
        traditionalChinese: '軟件工程原則和設計模式是主要話題。我們學習了SOLID原則、依賴注入以及編寫可維護代碼的重要性。還強調了代碼審查和測試策略。',
        italian: 'I principi di ingegneria del software e i design pattern erano gli argomenti principali. Abbiamo imparato i principi SOLID, l\'iniezione di dipendenze e l\'importanza di scrivere codice manutenibile. Sono state anche enfatizzate le revisioni del codice e le strategie di test.',
        spanish: 'Los principios de ingeniería de software y los patrones de diseño fueron los temas principales. Aprendimos sobre los principios SOLID, la inyección de dependencias y la importancia de escribir código mantenible. También se enfatizaron las revisiones de código y las estrategias de prueba.',
        japanese: 'ソフトウェアエンジニアリングの原則とデザインパターンが主なトピックでした。SOLID原則、依存性注入、保守可能なコードを書くことの重要性について学びました。コードレビューとテスト戦略も強調されました。',
        korean: '소프트웨어 엔지니어링 원칙과 디자인 패턴이 주요 주제였습니다. SOLID 원칙, 의존성 주입 및 유지 관리 가능한 코드 작성의 중요성에 대해 배웠습니다. 코드 리뷰 및 테스트 전략도 강조되었습니다.'
      },
      {
        id: 2,
        timestamp: '2:00',
        english: 'Agile methodologies and Scrum framework were introduced. The professor explained sprint planning, daily standups, and retrospectives. Understanding team collaboration is crucial for modern software development.',
        simplifiedChinese: '介绍了敏捷方法论和Scrum框架。教授解释了冲刺规划、每日站会和回顾会议。理解团队协作对现代软件开发至关重要。',
        traditionalChinese: '介紹了敏捷方法論和Scrum框架。教授解釋了衝刺規劃、每日站會和回顧會議。理解團隊協作對現代軟件開發至關重要。',
        italian: 'Sono state introdotte le metodologie Agile e il framework Scrum. Il professore ha spiegato la pianificazione degli sprint, i daily standup e le retrospettive. Comprendere la collaborazione di squadra è cruciale per lo sviluppo software moderno.',
        spanish: 'Se introdujeron las metodologías ágiles y el marco Scrum. El profesor explicó la planificación de sprints, las reuniones diarias y las retrospectivas. Comprender la colaboración en equipo es crucial para el desarrollo de software moderno.',
        japanese: 'アジャイル方法論とスクラムフレームワークが紹介されました。教授は、スプリント計画、デイリースタンドアップ、レトロスペクティブについて説明しました。チームコラボレーションを理解することは、現代のソフトウェア開発にとって重要です。',
        korean: '애자일 방법론과 스크럼 프레임워크가 소개되었습니다. 교수는 스프린트 계획, 일일 스탠드업 및 회고에 대해 설명했습니다. 팀 협업을 이해하는 것은 현대 소프트웨어 개발에 중요합니다.'
      }
    ],
    'Lecture 5': [
      {
        id: 1,
        timestamp: '0:00',
        english: 'Cloud computing and distributed systems were covered extensively. We discussed microservices architecture, containerization with Docker, and orchestration with Kubernetes. Scalability and fault tolerance are key considerations.',
        simplifiedChinese: '广泛讨论了云计算和分布式系统。我们讨论了微服务架构、使用Docker的容器化以及使用Kubernetes的编排。可扩展性和容错性是关键考虑因素。',
        traditionalChinese: '廣泛討論了雲計算和分佈式系統。我們討論了微服務架構、使用Docker的容器化以及使用Kubernetes的編排。可擴展性和容錯性是關鍵考慮因素。',
        italian: 'Il cloud computing e i sistemi distribuiti sono stati trattati ampiamente. Abbiamo discusso l\'architettura dei microservizi, la containerizzazione con Docker e l\'orchestrazione con Kubernetes. La scalabilità e la tolleranza ai guasti sono considerazioni chiave.',
        spanish: 'La computación en la nube y los sistemas distribuidos se cubrieron extensamente. Discutimos la arquitectura de microservicios, la contenedorización con Docker y la orquestación con Kubernetes. La escalabilidad y la tolerancia a fallos son consideraciones clave.',
        japanese: 'クラウドコンピューティングと分散システムについて広範囲に取り上げました。マイクロサービスアーキテクチャ、Dockerによるコンテナ化、Kubernetesによるオーケストレーションについて議論しました。スケーラビリティとフォールトトレランスが重要な考慮事項です。',
        korean: '클라우드 컴퓨팅과 분산 시스템에 대해 광범위하게 다루었습니다. 마이크로서비스 아키텍처, Docker를 사용한 컨테이너화 및 Kubernetes를 사용한 오케스트레이션에 대해 논의했습니다. 확장성과 내결함성이 주요 고려 사항입니다.'
      },
      {
        id: 2,
        timestamp: '1:50',
        english: 'Database sharding, replication, and consistency models were explained. The CAP theorem and its implications for distributed database design were particularly interesting topics.',
        simplifiedChinese: '解释了数据库分片、复制和一致性模型。CAP定理及其对分布式数据库设计的影响是特别有趣的话题。',
        traditionalChinese: '解釋了數據庫分片、複製和一致性模型。CAP定理及其對分佈式數據庫設計的影響是特別有趣的話題。',
        italian: 'Sono stati spiegati lo sharding del database, la replica e i modelli di coerenza. Il teorema CAP e le sue implicazioni per la progettazione di database distribuiti erano argomenti particolarmente interessanti.',
        spanish: 'Se explicaron el sharding de bases de datos, la replicación y los modelos de consistencia. El teorema CAP y sus implicaciones para el diseño de bases de datos distribuidas fueron temas particularmente interesantes.',
        japanese: 'データベースシャーディング、レプリケーション、一貫性モデルについて説明しました。CAP定理と分散データベース設計への影響は特に興味深いトピックでした。',
        korean: '데이터베이스 샤딩, 복제 및 일관성 모델에 대해 설명했습니다. CAP 정리와 분산 데이터베이스 설계에 대한 영향은 특히 흥미로운 주제였습니다.'
      }
    ]
  };

  // Hardcoded summary data for different lectures
  const summaryData = {
    'Lecture 1': {
      mainTopic: 'The talk covered connection strategies, suggesting students connect with industry leaders and professionals in their desired field. She recommended personalization in connection requests and engaging with content by commenting on posts, joining industry groups, and occasionally posting thoughtful content.',
      mainTopicChinese: '该讲座涵盖了联系策略，建议学生与行业领导者和他们期望领域的专业人士建立联系。她建议在联系请求中进行个性化设置，并通过评论帖子、加入行业小组以及偶尔发布有思想的内容来参与互动。',
      keyFormulas: [
        'The section on keyword optimization and headline strategy was most valuable, particularly the word cloud generator technique for identifying industry-specific keywords.',
        'Emily Perry explained analyzing job postings to create word clouds extracting commonly used terms, providing a concrete approach for modifying LinkedIn profiles to meet employer expectations.',
        'LinkedIn functions as a recruiter search engine, with headlines playing a significant role in search algorithms - transforming professional image building from passive resumes to active marketing tools.'
      ]
    },
    'Lecture 2': {
      mainTopic: 'Today\'s lecture focused on data structures and algorithms, covering binary search trees, their properties, and implementation details. The professor emphasized understanding time and space complexity when choosing appropriate data structures.',
      mainTopicChinese: '今天的讲座重点是数据结构和算法，涵盖了二叉搜索树、它们的属性和实现细节。教授强调了在选择适当的数据结构时理解时间和空间复杂度的重要性。',
      keyFormulas: [
        'Binary search trees provide O(log n) average case performance for search, insert, and delete operations.',
        'Tree traversal methods include in-order (left-root-right), pre-order (root-left-right), and post-order (left-right-root).',
        'Real-world applications include database indexing and file system organization for efficient data retrieval.'
      ]
    },
    'Lecture 3': {
      mainTopic: 'Machine learning fundamentals were introduced, exploring supervised learning, unsupervised learning, and reinforcement learning paradigms. The distinction between classification and regression problems was particularly emphasized.',
      mainTopicChinese: '介绍了机器学习基础知识，探讨了监督学习、无监督学习和强化学习范式。特别强调了分类和回归问题之间的区别。',
      keyFormulas: [
        'Supervised learning uses labeled data to train models for prediction tasks.',
        'Neural networks use backpropagation to calculate gradients and update weights during training.',
        'Gradient descent is essential for minimizing loss functions and optimizing model parameters.'
      ]
    },
    'Lecture 4': {
      mainTopic: 'Software engineering principles and design patterns were the main topics. We learned about SOLID principles, dependency injection, and the importance of writing maintainable code. Code reviews and testing strategies were also emphasized.',
      mainTopicChinese: '软件工程原则和设计模式是主要话题。我们学习了SOLID原则、依赖注入以及编写可维护代码的重要性。还强调了代码审查和测试策略。',
      keyFormulas: [
        'SOLID principles: Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.',
        'Agile methodologies include sprint planning, daily standups, and retrospectives for iterative development.',
        'Test-driven development (TDD) improves code quality and reduces bugs through early testing.'
      ]
    },
    'Lecture 5': {
      mainTopic: 'Cloud computing and distributed systems were covered extensively. We discussed microservices architecture, containerization with Docker, and orchestration with Kubernetes. Scalability and fault tolerance are key considerations.',
      mainTopicChinese: '广泛讨论了云计算和分布式系统。我们讨论了微服务架构、使用Docker的容器化以及使用Kubernetes的编排。可扩展性和容错性是关键考虑因素。',
      keyFormulas: [
        'Microservices architecture breaks applications into small, independent services for better scalability.',
        'Docker containers provide consistent environments across development, testing, and production.',
        'The CAP theorem states distributed systems can only guarantee two of: Consistency, Availability, Partition tolerance.'
      ]
    }
  };

  // Get notes for current lecture, default to Lecture 1 if not found
  const initialNotes = notesData[lectureTitle] || notesData['Lecture 1'];
  const [displayedNotes, setDisplayedNotes] = useState(initialNotes);
  const currentSummary = summaryData[lectureTitle] || summaryData['Lecture 1'];

  // Register handler for recording context
  React.useEffect(() => {
    const handleTranscription = (text) => {
      const newNote = {
        id: displayedNotes.length + 1,
        timestamp: 'New',
        ...text
      };
      setDisplayedNotes(prev => [...prev, newNote]);
    };

    registerHandler(handleTranscription);

    return () => {
      unregisterHandler();
    };
  }, [displayedNotes, registerHandler, unregisterHandler]);

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
      <TouchableOpacity
        onPress={() => navigation.navigate('LanguageSelection', {
          currentLanguage: selectedLanguage
        })}
        style={styles.globeIconButton}
      >
        <MaterialCommunityIcons name="web" size={20} color="#E8504C" />
      </TouchableOpacity>
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
  const NoteEntry = ({ note }) => {
    const getTranslationText = () => {
      if (!autoTranslate) return null;

      // Language prefix mapping
      const languagePrefixes = {
        'english': 'E',
        'simplifiedChinese': '中',
        'traditionalChinese': '繁',
        'italian': 'IT',
        'spanish': 'ES',
        'japanese': '日',
        'korean': '한'
      };

      // Get the translation text based on selected language
      const translationText = note[selectedLanguage];
      const prefix = languagePrefixes[selectedLanguage] || '';

      if (!translationText) {
        return null;
      }

      return (
        <Text style={styles.chineseText}>
          {prefix}：{translationText}
        </Text>
      );
    };

    return (
      <View style={styles.noteEntry}>
        <View style={styles.timestampContainer}>
          <Text style={styles.timestamp}>{note.timestamp}</Text>
          <Text style={styles.speaker}>E : </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.englishText}>{note.english}</Text>
          {getTranslationText()}
        </View>
      </View>
    );
  };

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
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Summary' && styles.tabActive]}
            onPress={() => setActiveTab('Summary')}
          >
            <Text style={[styles.tabText, activeTab === 'Summary' && styles.tabTextActive]}>Summary</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Transcript' && styles.tabActive]}
            onPress={() => setActiveTab('Transcript')}
          >
            <Text style={[styles.tabText, activeTab === 'Transcript' && styles.tabTextActive]}>Transcript</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Note' && styles.tabActive]}
            onPress={() => setActiveTab('Note')}
          >
            <Text style={[styles.tabText, activeTab === 'Note' && styles.tabTextActive]}>Note</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Summary Content */}
        {activeTab === 'Summary' && (
          <View style={styles.summaryContainer}>
            {/* Summary Header */}
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>Summary:</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('LanguageSelection', {
                  currentLanguage: selectedLanguage
                })}
              >
                <MaterialCommunityIcons name="web" size={24} color="#E8504C" />
              </TouchableOpacity>
            </View>

            {/* Main Topic Section */}
            <View style={styles.summarySection}>
              <Text style={styles.sectionTitle}>Main Topic :</Text>
              <Text style={styles.mainTopicText}>
                <Text style={styles.boldLabel}>E : </Text>
                {currentSummary.mainTopic}
              </Text>
              {autoTranslate && (
                <Text style={styles.chineseText}>
                  中：{currentSummary.mainTopicChinese}
                </Text>
              )}
            </View>

            {/* Key Formula Section */}
            <View style={styles.summarySection}>
              <Text style={styles.sectionTitle}>Key Formula :</Text>
              {currentSummary.keyFormulas.map((formula, index) => (
                <View key={index} style={styles.formulaItem}>
                  <Text style={styles.formulaNumber}>{index + 1}. </Text>
                  <Text style={styles.formulaText}>{formula}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Transcript Content */}
        {activeTab === 'Transcript' && (
          <>
            {/* Transcript Header with Auto Translate */}
            <View style={styles.transcriptHeader}>
              <Text style={styles.transcriptTitle}>Transcript:</Text>
              <AutoTranslateToggle />
            </View>

            {/* Notes Content */}
            <View style={styles.notesContent}>
              {displayedNotes.map((note) => (
                <NoteEntry key={note.id} note={note} />
              ))}
              {isProcessing && (
                <View style={styles.processingContainer}>
                  <ActivityIndicator size="small" color="#3B6FE8" />
                  <Text style={styles.processingText}>Transcribing...</Text>
                </View>
              )}
            </View>
          </>
        )}

        {/* Note Content (Placeholder) */}
        {activeTab === 'Note' && (
          <View style={styles.noteContainer}>
            <Text style={styles.placeholderText}>Note feature coming soon...</Text>
          </View>
        )}

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
  globeIconButton: {
    padding: 2,
  },
  toggleLabel: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },

  // Summary Styles
  summaryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  summarySection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 10,
  },
  mainTopicText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 22,
    marginBottom: 8,
  },
  boldLabel: {
    fontWeight: 'bold',
  },
  formulaItem: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingLeft: 5,
  },
  formulaNumber: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    marginRight: 5,
  },
  formulaText: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },

  // Note Placeholder
  noteContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
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

  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  processingText: {
    color: '#666',
    fontSize: 14,
  },
});
