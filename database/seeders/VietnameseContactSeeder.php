<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class VietnameseContactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create test user
        $user = \App\Models\User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Nguyễn Văn Test',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        // Create groups for the user
        $groups = [
            ['name' => 'Gia Đình', 'color' => '#10B981', 'description' => 'Thành viên gia đình'],
            ['name' => 'Bạn Bè', 'color' => '#3B82F6', 'description' => 'Bạn thân'],
            ['name' => 'Công Việc', 'color' => '#F59E0B', 'description' => 'Đồng nghiệp'],
            ['name' => 'Kinh Doanh', 'color' => '#8B5CF6', 'description' => 'Đối tác kinh doanh'],
            ['name' => 'Khách Hàng', 'color' => '#EF4444', 'description' => 'Khách hàng quan trọng'],
        ];

        $groupModels = [];
        foreach ($groups as $group) {
            $groupModels[] = \App\Models\Group::firstOrCreate(
                ['user_id' => $user->id, 'name' => $group['name']],
                ['color' => $group['color'], 'description' => $group['description']]
            );
        }

        // Create tags for the user
        $tags = [
            ['name' => 'Quan Trọng', 'color' => '#EF4444'],
            ['name' => 'Cần Liên Hệ', 'color' => '#F59E0B'],
            ['name' => 'VIP', 'color' => '#10B981'],
            ['name' => 'Đối Tác', 'color' => '#3B82F6'],
            ['name' => 'Tiềm Năng', 'color' => '#8B5CF6'],
        ];

        $tagModels = [];
        foreach ($tags as $tag) {
            $tagModels[] = \App\Models\Tag::firstOrCreate(
                ['user_id' => $user->id, 'name' => $tag['name']],
                ['color' => $tag['color']]
            );
        }

        // Vietnamese contacts data
        $contacts = [
            // Gia Đình
            [
                'first_name' => 'Nguyễn Văn',
                'last_name' => 'An',
                'phone_number' => '0912 345 678',
                'email' => 'nguyen.van.an@gmail.com',
                'company' => null,
                'job_title' => null,
                'address' => '123 Trần Hưng Đạo, Q.1, TP.HCM',
                'birthday' => '1985-03-15',
                'is_favorite' => true,
                'group' => 'Gia Đình',
                'tags' => ['Quan Trọng'],
            ],
            [
                'first_name' => 'Trần Thị',
                'last_name' => 'Bình',
                'phone_number' => '0987 654 321',
                'email' => 'tran.thi.binh@gmail.com',
                'company' => null,
                'job_title' => null,
                'address' => '456 Lê Lợi, Q.3, TP.HCM',
                'birthday' => '1990-07-20',
                'is_favorite' => true,
                'group' => 'Gia Đình',
                'tags' => ['Quan Trọng'],
            ],
            [
                'first_name' => 'Lê Minh',
                'last_name' => 'Châu',
                'phone_number' => '0901 234 567',
                'email' => 'le.minh.chau@gmail.com',
                'company' => null,
                'job_title' => null,
                'address' => '789 Nguyễn Huệ, Q.1, TP.HCM',
                'birthday' => '2000-12-10',
                'is_favorite' => true,
                'group' => 'Gia Đình',
                'tags' => [],
            ],

            // Bạn Bè
            [
                'first_name' => 'Phạm Văn',
                'last_name' => 'Dũng',
                'phone_number' => '0913 456 789',
                'email' => 'pham.van.dung@gmail.com',
                'company' => 'FPT Software',
                'job_title' => 'Software Engineer',
                'address' => '234 Võ Văn Tần, Q.3, TP.HCM',
                'birthday' => '1995-05-25',
                'is_favorite' => true,
                'group' => 'Bạn Bè',
                'tags' => ['Cần Liên Hệ'],
            ],
            [
                'first_name' => 'Hoàng Thị',
                'last_name' => 'Lan',
                'phone_number' => '0988 765 432',
                'email' => 'hoang.thi.lan@gmail.com',
                'company' => 'VinGroup',
                'job_title' => 'Marketing Manager',
                'address' => '567 Hai Bà Trưng, Q.1, TP.HCM',
                'birthday' => '1992-08-30',
                'is_favorite' => false,
                'group' => 'Bạn Bè',
                'tags' => [],
            ],
            [
                'first_name' => 'Đặng Quốc',
                'last_name' => 'Hùng',
                'phone_number' => '0902 345 678',
                'email' => 'dang.quoc.hung@gmail.com',
                'company' => 'Tiki',
                'job_title' => 'Product Manager',
                'address' => '890 Lý Tự Trọng, Q.1, TP.HCM',
                'birthday' => '1993-11-15',
                'is_favorite' => false,
                'group' => 'Bạn Bè',
                'tags' => [],
            ],

            // Công Việc
            [
                'first_name' => 'Võ Văn',
                'last_name' => 'Khang',
                'phone_number' => '0914 567 890',
                'email' => 'vo.van.khang@fpt.com.vn',
                'company' => 'FPT Telecom',
                'job_title' => 'Technical Lead',
                'address' => '111 Nguyễn Văn Cừ, Q.5, TP.HCM',
                'is_favorite' => false,
                'group' => 'Công Việc',
                'tags' => ['Đối Tác'],
            ],
            [
                'first_name' => 'Bùi Thị',
                'last_name' => 'Mai',
                'phone_number' => '0989 876 543',
                'email' => 'bui.thi.mai@viettel.com.vn',
                'company' => 'Viettel',
                'job_title' => 'HR Manager',
                'address' => '222 Cách Mạng Tháng 8, Q.10, TP.HCM',
                'is_favorite' => false,
                'group' => 'Công Việc',
                'tags' => [],
            ],
            [
                'first_name' => 'Đinh Công',
                'last_name' => 'Phượng',
                'phone_number' => '0903 456 789',
                'email' => 'dinh.cong.phuong@vnpt.vn',
                'company' => 'VNPT',
                'job_title' => 'System Administrator',
                'address' => '333 Điện Biên Phủ, Q.3, TP.HCM',
                'is_favorite' => false,
                'group' => 'Công Việc',
                'tags' => [],
            ],

            // Kinh Doanh
            [
                'first_name' => 'Trương Minh',
                'last_name' => 'Quang',
                'phone_number' => '0915 678 901',
                'email' => 'truong.minh.quang@momo.vn',
                'company' => 'MoMo',
                'job_title' => 'Business Development',
                'address' => '444 Nguyễn Thị Minh Khai, Q.1, TP.HCM',
                'is_favorite' => true,
                'group' => 'Kinh Doanh',
                'tags' => ['VIP', 'Đối Tác'],
            ],
            [
                'first_name' => 'Phan Thị',
                'last_name' => 'Thảo',
                'phone_number' => '0990 987 654',
                'email' => 'phan.thi.thao@shopee.vn',
                'company' => 'Shopee',
                'job_title' => 'Partnership Manager',
                'address' => '555 Lê Văn Sỹ, Q.3, TP.HCM',
                'is_favorite' => true,
                'group' => 'Kinh Doanh',
                'tags' => ['VIP', 'Quan Trọng'],
            ],
            [
                'first_name' => 'Ngô Văn',
                'last_name' => 'Sơn',
                'phone_number' => '0904 567 890',
                'email' => 'ngo.van.son@grab.com',
                'company' => 'Grab',
                'job_title' => 'Sales Director',
                'address' => '666 Hoàng Văn Thụ, Q.Phú Nhuận, TP.HCM',
                'is_favorite' => true,
                'group' => 'Kinh Doanh',
                'tags' => ['VIP', 'Đối Tác'],
            ],

            // Khách Hàng
            [
                'first_name' => 'Lý Thanh',
                'last_name' => 'Tùng',
                'phone_number' => '0916 789 012',
                'email' => 'ly.thanh.tung@tech.vn',
                'company' => 'Tech Solutions Vietnam',
                'job_title' => 'CEO',
                'address' => '777 Phan Xích Long, Q.Phú Nhuận, TP.HCM',
                'is_favorite' => true,
                'group' => 'Khách Hàng',
                'tags' => ['VIP', 'Quan Trọng', 'Cần Liên Hệ'],
            ],
            [
                'first_name' => 'Đỗ Thị',
                'last_name' => 'Uyên',
                'phone_number' => '0991 098 765',
                'email' => 'do.thi.uyen@fashion.vn',
                'company' => 'Fashion House Vietnam',
                'job_title' => 'Founder',
                'address' => '888 Trần Quang Khải, Q.1, TP.HCM',
                'is_favorite' => true,
                'group' => 'Khách Hàng',
                'tags' => ['VIP', 'Tiềm Năng'],
            ],
            [
                'first_name' => 'Hồ Quang',
                'last_name' => 'Vinh',
                'phone_number' => '0905 678 901',
                'email' => 'ho.quang.vinh@restaurant.vn',
                'company' => 'Golden Dragon Restaurant',
                'job_title' => 'Owner',
                'address' => '999 Nguyễn Trãi, Q.5, TP.HCM',
                'is_favorite' => false,
                'group' => 'Khách Hàng',
                'tags' => ['Tiềm Năng'],
            ],

            // Thêm contacts
            [
                'first_name' => 'Vũ Thị',
                'last_name' => 'Yến',
                'phone_number' => '0917 890 123',
                'email' => 'vu.thi.yen@edu.vn',
                'company' => 'Đại học Bách Khoa',
                'job_title' => 'Giảng viên',
                'address' => '268 Lý Thường Kiệt, Q.10, TP.HCM',
                'birthday' => '1988-04-12',
                'is_favorite' => false,
                'group' => 'Bạn Bè',
                'tags' => [],
            ],
            [
                'first_name' => 'Cao Minh',
                'last_name' => 'Đức',
                'phone_number' => '0992 109 876',
                'email' => 'cao.minh.duc@startup.vn',
                'company' => 'AI Startup Vietnam',
                'job_title' => 'CTO',
                'address' => '123 Võ Thị Sáu, Q.3, TP.HCM',
                'is_favorite' => true,
                'group' => 'Kinh Doanh',
                'tags' => ['VIP', 'Tiềm Năng'],
            ],
            [
                'first_name' => 'Mai Xuân',
                'last_name' => 'Bách',
                'phone_number' => '0906 789 012',
                'email' => 'mai.xuan.bach@bank.vn',
                'company' => 'Vietcombank',
                'job_title' => 'Branch Manager',
                'address' => '456 Nam Kỳ Khởi Nghĩa, Q.1, TP.HCM',
                'is_favorite' => false,
                'group' => 'Công Việc',
                'tags' => [],
            ],
            [
                'first_name' => 'Lâm Thị',
                'last_name' => 'Hồng',
                'phone_number' => '0918 901 234',
                'email' => 'lam.thi.hong@hospital.vn',
                'company' => 'Bệnh viện Chợ Rẫy',
                'job_title' => 'Bác sĩ',
                'address' => '201 Nguyễn Chí Thanh, Q.5, TP.HCM',
                'birthday' => '1987-09-05',
                'is_favorite' => false,
                'group' => 'Bạn Bè',
                'tags' => [],
            ],
            [
                'first_name' => 'Dương Văn',
                'last_name' => 'Kiên',
                'phone_number' => '0993 210 987',
                'email' => 'duong.van.kien@media.vn',
                'company' => 'VTV Digital',
                'job_title' => 'Content Creator',
                'address' => '789 Bạch Đằng, Q.Bình Thạnh, TP.HCM',
                'is_favorite' => false,
                'group' => 'Công Việc',
                'tags' => ['Cần Liên Hệ'],
            ],
        ];

        // Create contacts
        foreach ($contacts as $contactData) {
            $groupName = $contactData['group'];
            $tagNames = $contactData['tags'];
            unset($contactData['group'], $contactData['tags']);

            $contact = \App\Models\Contact::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'phone_number' => $contactData['phone_number'],
                ],
                array_merge(['user_id' => $user->id], $contactData)
            );

            // Assign group
            $group = collect($groupModels)->firstWhere('name', $groupName);
            if ($group) {
                $contact->group_id = $group->id;
                $contact->save();
            }

            // Assign tags
            $tags = collect($tagModels)->whereIn('name', $tagNames);
            if ($tags->isNotEmpty()) {
                $contact->tags()->sync($tags->pluck('id')->toArray());
            }
        }

        $this->command->info('✅ Đã tạo ' . count($contacts) . ' contacts người Việt Nam!');
        $this->command->info('📧 Login: test@example.com / password');
    }
}
