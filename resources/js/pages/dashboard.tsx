import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { type Contact, type Group, type Tag } from '@/types/contact';
import { Head, Link } from '@inertiajs/react';
import {
    FolderOpen,
    Heart,
    Mail,
    Phone,
    Plus,
    Tag as TagIcon,
    Users,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardProps {
    stats: {
        total_contacts: number;
        favorite_contacts: number;
        total_groups: number;
        total_tags: number;
    };
    recentContacts: Contact[];
    groups: Group[];
    tags: Tag[];
}

export default function Dashboard({
    stats,
    recentContacts,
    groups,
    tags,
}: DashboardProps) {
    const getInitials = (contact: Contact) => {
        return `${contact.first_name[0]}${contact.last_name[0]}`.toUpperCase();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Trang tổng quan
                        </h1>
                        <p className="text-muted-foreground">
                            Chào mừng bạn trở lại! Đây là cái nhìn tổng quan về danh bạ của bạn.
                        </p>
                    </div>

                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Total Contacts */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Tổng số liên hệ
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_contacts}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Tất cả các liên hệ trong danh bạ của bạn
                            </p>
                        </CardContent>
                    </Card>

                    {/* Favorites */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Yêu thích
                            </CardTitle>
                            <Heart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.favorite_contacts}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Đã đánh dấu là yêu thích
                            </p>
                        </CardContent>
                    </Card>

                    {/* Groups */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Nhóm
                            </CardTitle>
                            <FolderOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_groups}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Nhóm liên hệ
                            </p>
                        </CardContent>
                    </Card>

                    {/* Tags */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Nhãn
                            </CardTitle>
                            <TagIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_tags}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Nhãn liên hệ
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Recent Contacts */}
                    <Card className="col-span-4">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Liên hệ gần đây</CardTitle>
                                    <CardDescription>
                                        5 liên hệ gần đây nhất của bạn
                                    </CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/contacts">Xem tất cả</Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {recentContacts.length > 0 ? (
                                <div className="space-y-4">
                                    {recentContacts.map((contact) => (
                                        <Link
                                            key={contact.id}
                                            href={`/contacts/${contact.id}`}
                                            className="flex items-center space-x-4 rounded-lg p-2 transition-colors hover:bg-accent"
                                        >
                                            <Avatar>
                                                <AvatarImage
                                                    src={
                                                        contact.avatar_url ||
                                                        undefined
                                                    }
                                                />
                                                <AvatarFallback>
                                                    {getInitials(contact)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm leading-none font-medium">
                                                    {contact.full_name}
                                                    {contact.is_favorite && (
                                                        <Heart className="ml-2 inline h-3 w-3 fill-red-500 text-red-500" />
                                                    )}
                                                </p>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Phone className="h-3 w-3" />
                                                    <span>
                                                        {contact.phone_number}
                                                    </span>
                                                    {contact.email && (
                                                        <>
                                                            <Mail className="ml-2 h-3 w-3" />
                                                            <span>
                                                                {contact.email}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                                {contact.group && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                        style={{
                                                            backgroundColor:
                                                                contact.group
                                                                    .color,
                                                        }}
                                                    >
                                                        {contact.group.name}
                                                    </Badge>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <Users className="h-12 w-12 text-muted-foreground" />
                                    <h3 className="mt-4 text-lg font-semibold">
                                        Chưa có địa chỉ liên hệ nào
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Bắt đầu bằng cách thêm địa chỉ liên hệ đầu tiên của bạn
                                    </p>
                                    <Button asChild className="mt-4">
                                        <Link href="/contacts/create">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Thêm liên hệ
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Top Groups & Tags */}
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Danh mục hàng đầu</CardTitle>
                            <CardDescription>
                                Nhóm và nhãn được sử dụng nhiều nhất
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Groups */}
                                <div>
                                    <div className="mb-3 flex items-center justify-between">
                                        <h4 className="text-sm font-semibold">
                                            Nhóm
                                        </h4>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            asChild
                                        >
                                            <Link href="/groups">Xem tất cả</Link>
                                        </Button>
                                    </div>
                                    {groups.length > 0 ? (
                                        <div className="space-y-2">
                                            {groups.map((group) => (
                                                <Link
                                                    key={group.id}
                                                    href={`/groups/${group.id}`}
                                                    className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-accent"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <div
                                                            className="h-3 w-3 rounded-full"
                                                            style={{
                                                                backgroundColor:
                                                                    group.color,
                                                            }}
                                                        />
                                                        <span className="text-sm">
                                                            {group.name}
                                                        </span>
                                                    </div>
                                                    <Badge variant="secondary">
                                                        {group.contacts_count}
                                                    </Badge>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            Chưa có nhóm nào
                                        </p>
                                    )}
                                </div>

                                {/* Tags */}
                                <div>
                                    <div className="mb-3 flex items-center justify-between">
                                        <h4 className="text-sm font-semibold">
                                            Nhãn
                                        </h4>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            asChild
                                        >
                                            <Link href="/tags">Xem tất cả</Link>
                                        </Button>
                                    </div>
                                    {tags.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {tags.map((tag) => (
                                                <Link
                                                    key={tag.id}
                                                    href={`/tags/${tag.id}`}
                                                >
                                                    <Badge
                                                        variant="outline"
                                                        className="cursor-pointer transition-colors hover:bg-accent"
                                                        style={{
                                                            borderColor:
                                                                tag.color,
                                                            color: tag.color,
                                                        }}
                                                    >
                                                        {tag.name}
                                                        <span className="ml-1 text-xs text-muted-foreground">
                                                            (
                                                            {tag.contacts_count}
                                                            )
                                                        </span>
                                                    </Badge>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            Chưa có nhãn nào
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thao tác nhanh</CardTitle>
                        <CardDescription>
                            Các tác vụ phổ biến để quản lý địa chỉ liên hệ của bạn
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <Button asChild variant="outline" className="h-24">
                                <Link
                                    href="/contacts/create"
                                    className="flex flex-col items-center justify-center"
                                >
                                    <Plus className="mb-2 h-6 w-6" />
                                    <span>Thêm liên hệ</span>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-24">
                                <Link
                                    href="/contacts?is_favorite=true"
                                    className="flex flex-col items-center justify-center"
                                >
                                    <Heart className="mb-2 h-6 w-6" />
                                    <span>Xem yêu thích</span>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-24">
                                <Link
                                    href="/groups/create"
                                    className="flex flex-col items-center justify-center"
                                >
                                    <FolderOpen className="mb-2 h-6 w-6" />
                                    <span>Tạo nhóm</span>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-24">
                                <Link
                                    href="/tags/create"
                                    className="flex flex-col items-center justify-center"
                                >
                                    <TagIcon className="mb-2 h-6 w-6" />
                                    <span>Tạo nhãn</span>
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
