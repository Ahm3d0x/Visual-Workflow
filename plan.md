تمام. بعد ما بصيت على المشروع: هو حاليا `index.html` واحد، بيخزن محليا في `IndexedDB`، وفيه Dashboard + Workflows + Nodes + Edges + undo/redo + canvas بسيط. النقلة اللي أنت طالبها معناها نحوله من أداة محلية إلى SaaS كامل للـ Visual Workflow.

**الرؤية**
نحوّل Visual Workflow Builder إلى منصة احترافية لإنشاء وإدارة ومشاركة Workflows، فيها تسجيل دخول، مزامنة سحابية، تعاون لحظي، خطط مدفوعة، ذكاء اصطناعي مساعد، مكتبة عناصر ضخمة، وتجربة ممتازة على الكمبيوتر والتابلت والموبايل.

**الستاك المقترح**

- Frontend: `Next.js` + `TypeScript` + `React Flow` أو `XYFlow` للـ workflow canvas.
- UI: `Tailwind CSS` + `shadcn/ui` + `lucide-react`.
- Database/Auth/Realtime: `Supabase`.
- Payments: `Stripe`.
- Realtime collaboration: Supabase Realtime + Presence + Broadcast.
- State: `Zustand`.
- Forms/validation: `React Hook Form` + `Zod`.
- AI features: OpenAI API & giminai

**مراحل التطوير**

**1. إعادة بناء الأساس**

- تحويل المشروع من ملف HTML واحد إلى تطبيق Next.js منظم.
- تقسيم التطبيق إلى:
  - Auth pages
  - Dashboard
  - Workflow editor
  - Workspace/team settings
  - Billing
  - Templates marketplace
- نقل التخزين من IndexedDB إلى Supabase.
- الاحتفاظ بإمكانية offline draft لاحقا كميزة إضافية.

**2. نظام الحسابات**

- تسجيل حساب بالإيميل وكلمة المرور.
- تسجيل الدخول بجوجل عبر Supabase Auth.
- صفحة Profile.
- Forgot password.
- Email verification.
- حماية الصفحات حسب تسجيل الدخول.
- ربط كل Dashboard وWorkflow بالمستخدم أو الفريق.

**3. الداشبورد الجديد**

- عرض كل الـ workflows كقائمة أو grid.
- بحث سريع.
- فلاتر: آخر تعديل، المالك، المشتركين، الحالة، النوع.
- مجلدات أو Workspaces.
- إحصائيات:
  - عدد الـ workflows.
  - عدد العناصر المستخدمة.
  - عدد المشاركات.
  - استهلاك الخطة.
  - آخر نشاط.
- Quick actions:
  - إنشاء Workflow.
  - استيراد.
  - فتح template.
  - دعوة عضو.
  - نسخ workflow.
  - أرشفة أو حذف.

**4. محرر الـ Workflow**

- Canvas احترافي باستخدام React Flow.
- Zoom / pan / minimap / fit view.
- Grid و snap-to-grid.
- Multi-select.
- نسخ/لصق.
- Undo/redo أقوى.
- Grouping للعناصر.
- Layers panel.
- Properties panel متقدم.
- Auto layout.
- Keyboard shortcuts.
- Version history.
- Comments على كل node.
- Status لكل workflow: Draft, Active, Archived, Published.
- Export إلى PNG / SVG / PDF / JSON.
- Import من JSON.

**5. مكتبة العناصر الجديدة**
بدل 4 عناصر فقط، نقسم المكتبة إلى مجموعات:

- Basic:
  - Start
  - End
  - Process
  - Decision
  - Note
  - Group
  - Connector
  - Delay

- Data:
  - Input
  - Output
  - Variable
  - Table lookup
  - Transform
  - Filter
  - Mapper

- Logic:
  - If / Else
  - Switch
  - Loop
  - Parallel
  - Merge
  - Retry
  - Error handler

- Integrations:
  - API Request
  - Webhook
  - Email
  - SMS
  - Slack/Discord
  - Database query
  - File upload
  - Google Sheets
  - CRM action

- AI:
  - Generate text
  - Classify
  - Extract data
  - Summarize
  - Route decision
  - AI validator
  - AI workflow assistant

- UI/Form:
  - Form step
  - Approval step
  - User task
  - Checklist
  - Attachment
  - Signature

**6. خصائص العناصر**
كل نوع عنصر يكون له properties مختلفة. مثلا:

- API Request:
  - Method
  - URL
  - Headers
  - Body
  - Auth type
  - Timeout
  - Retry policy
  - Success/error branches

- Decision:
  - Conditions
  - Operators
  - Multiple branches
  - Fallback branch

- Email:
  - Recipient
  - Subject
  - Template
  - Variables
  - Attachments

- AI Node:
  - Model
  - Prompt
  - Input mapping
  - Output schema
  - Token limit
  - Cost estimate

- Form Step:
  - Fields
  - Required validation
  - Field types
  - Submit action
  - Assigned user/team

**7. التعاون اللحظي**

- مشاركة workflow مع مستخدمين آخرين.
- صلاحيات:
  - Owner
  - Editor
  - Commenter
  - Viewer
- ظهور المستخدمين المتصلين حاليا.
- مؤشرات cursors على الـ canvas.
- تحديث لحظي للعناصر والروابط.
- Comments و mentions.
- Activity log.
- Conflict handling عند تعديل نفس العنصر.
- Invite by email أو public share link.

**8. Supabase schema المقترح**
الجداول الأساسية:

- `profiles`
  - `id`
  - `email`
  - `full_name`
  - `avatar_url`
  - `created_at`

- `workspaces`
  - `id`
  - `name`
  - `owner_id`
  - `plan`
  - `trial_ends_at`
  - `created_at`

- `workspace_members`
  - `workspace_id`
  - `user_id`
  - `role`

- `dashboards`
  - `id`
  - `workspace_id`
  - `name`
  - `created_by`
  - `created_at`

- `workflows`
  - `id`
  - `dashboard_id`
  - `workspace_id`
  - `name`
  - `description`
  - `status`
  - `created_by`
  - `updated_at`

- `workflow_nodes`
  - `id`
  - `workflow_id`
  - `type`
  - `position`
  - `data`
  - `style`
  - `created_at`

- `workflow_edges`
  - `id`
  - `workflow_id`
  - `source_node_id`
  - `target_node_id`
  - `source_handle`
  - `target_handle`
  - `data`

- `workflow_versions`
  - `id`
  - `workflow_id`
  - `snapshot`
  - `created_by`
  - `created_at`

- `workflow_comments`
  - `id`
  - `workflow_id`
  - `node_id`
  - `body`
  - `created_by`

- `subscriptions`
  - `workspace_id`
  - `plan`
  - `stripe_customer_id`
  - `stripe_subscription_id`
  - `status`

**9. الخطط المدفوعة**
أنت قلت “ثلاث أنواع” لكن كتبت أربع خطط: `warrior`, `elite`, `champion`, `legend`. أقترح نخليها: Free + 4 paid tiers.

| الخطة    |       Workflows | عناصر لكل workflow |           تعاون | AI         | مميزات                              |
| -------- | --------------: | -----------------: | --------------: | ---------- | ----------------------------------- |
| Free     |               3 |                 50 | مشاركة view فقط | محدود جدا  | Export JSON                         |
| Warrior  |              20 |                250 |         3 أعضاء | مساعد بسيط | Templates + PNG export              |
| Elite    |              75 |               1000 |        10 أعضاء | AI متوسط   | Realtime editing + version history  |
| Champion |             250 |               5000 |          30 عضو | AI قوي     | Integrations + advanced permissions |
| Legend   | غير محدود نسبيا |           كبير جدا |       فرق كبيرة | أعلى حدود  | White-label + priority support      |

**قيود مدفوعة مناسبة**

- عدد الـ workflows.
- عدد العناصر داخل workflow.
- عدد أعضاء التعاون.
- عدد الـ dashboards/workspaces.
- عدد نسخ version history.
- عدد AI credits شهريا.
- Export PDF/SVG.
- Advanced integrations.
- Workflow templates premium.
- Custom branding.
- Public share links.
- Role-based permissions.
- Audit logs.
- API access.
- Automation execution لاحقا.

**التجربة المجانية**

- أول 14 يوم Trial على خطة `Legend`.
- لا يحتاج بطاقة بنكية في البداية أو حسب قرارك التجاري.
- بعد نهاية التجربة يرجع تلقائيا إلى Free.
- إظهار usage meter واضح داخل الداشبورد.
- تنبيهات قبل الوصول للحدود.

**10. الذكاء الاصطناعي**

- إنشاء workflow من وصف نصي.
- اقتراح تحسينات على workflow موجود.
- اكتشاف أخطاء منطقية:
  - node بدون مخرج.
  - branches غير مكتملة.
  - loop خطر.
  - workflow كبير جدا.
- توليد وصف لكل node.
- تحويل process مكتوب إلى workflow.
- اقتراح أسماء، شروط، outputs.
- AI chat داخل المحرر.
- Auto-layout ذكي.
- AI templates حسب المجال: مبيعات، دعم، HR، e-commerce، operations.

**11. تجربة الموبايل والتابلت**

- على الكمبيوتر: sidebar + canvas + properties panel.
- على التابلت: panels قابلة للطي.
- على الموبايل:
  - وضع عرض/تعليق ممتاز.
  - تحرير مبسط.
  - bottom sheet للخصائص.
  - مكتبة عناصر في drawer.
  - gestures للزوم والتحريك.
- دعم RTL كامل.
- أزرار كبيرة للمس.
- حفظ تلقائي واضح.
- منع تداخل النصوص والعناصر.

**12. أولويات التنفيذ**

1. تحويل المشروع إلى Next.js.
2. بناء التصميم الجديد والـ layout الأساسي.
3. إعداد Supabase Auth مع Google login.
4. إنشاء schema + RLS policies.
5. نقل workflows/nodes/edges إلى Supabase.
6. بناء Dashboard جديد.
7. بناء Editor باستخدام React Flow.
8. إضافة مكتبة العناصر الجديدة.
9. إضافة properties panel متقدم.
10. إضافة sharing والصلاحيات.
11. إضافة realtime collaboration.
12. إضافة plans + Stripe.
13. إضافة trial لمدة 14 يوم.
14. إضافة AI assistant.
15. تحسين الأداء والتجربة على كل الشاشات.

**اقتراحي العملي**
نبدأ بمرحلة MVP قوية: Auth + Supabase + Dashboard جديد + Editor حديث + مكتبة عناصر موسعة + خطط اشتراك كمنطق داخلي بدون Stripe في البداية. بعد ما الأساس يثبت، نضيف Stripe والتعاون اللحظي والـ AI.

الخطوة التالية الأفضل: أبدأ بتحويل المشروع فعليا من `index.html` إلى تطبيق Next.js منظم، مع Supabase-ready architecture وصفحات Auth/Dashboard/Editor.
