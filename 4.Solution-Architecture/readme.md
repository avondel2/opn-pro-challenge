## 4. Solution Architecture
Design microservices architecture for MVP Instagram-like mobile application which supports bellowing features.

#### Features
- Content uploading - Photo and video should be resized and reformatting
- Feeds - Sort the selected content to each user
- Interaction - Like and comment at content also notify the content owner
- Messaging - Generic chat system
- Notification - Notify user on their phone and email
- Analytics - Report content's view and interaction daily and send to owner email

#### Requirements
- You need to consider the time-to-market as first priority, following with cost and extensibility.
- Your architecture can contain real service provider, e.g.: AWS, GCP, Firebase etc.
- The diagram should come with pros, cons, risks and extensibility.

#### Notes
- You are required to present this to the Engineering/Project/Business/Product/QA Team.

Pro
- สามารถดึงข้อมูล content ได้เร็วเพราะมีการใช้รวมกันทั้ง database และ elasticSearch
- ลด load ของ database ลงจากการใช้ ElasticSearch ดึงข้อมูลเก่าๆแทน
- extensibility ได้ดี
Con
- ราคาสูงเนื่องจากมีการใช้งานหลาย Tool หลาย Service