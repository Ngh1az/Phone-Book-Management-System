import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import { Contact, Group, PaginatedResponse } from '@/types/contact';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Mail, Phone, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

interface GroupShowProps {
    group: Group & { contacts_count: number };
    contacts: PaginatedResponse<Contact>;
}

export default function GroupShow({ group, contacts }: GroupShowProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleDelete = () => {
        router.delete(`/groups/${group.id}`, {
            onSuccess: () => {
                router.visit('/groups');
            },
        });
    };

    const getInitials = (contact: Contact) => {
        return `${contact.first_name[0]}${contact.last_name[0]}`.toUpperCase();
    };

    return (
        <AppLayout>
            <Head title={group.name} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Button variant="ghost" asChild>
                        <Link href="/groups">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Quay lại danh sách
                        </Link>
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/groups/${group.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            className="text-destructive"
                            onClick={() => setShowDeleteDialog(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                        </Button>
                    </div>
                </div>

                {/* Group Info */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <div
                                className="h-16 w-16 rounded-lg"
                                style={{ backgroundColor: group.color }}
                            />
                            <div className="flex-1">
                                <CardTitle className="text-2xl">
                                    {group.name}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-1 text-base">
                                    <Users className="h-4 w-4" />
                                    {group.contacts_count} liên hệ
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    {group.description && (
                        <CardContent>
                            <p className="text-muted-foreground">
                                {group.description}
                            </p>
                        </CardContent>
                    )}
                </Card>

                {/* Contacts List */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Liên hệ trong nhóm</CardTitle>
                                <CardDescription>
                                    Danh sách các liên hệ thuộc nhóm này
                                </CardDescription>
                            </div>
                            <Button asChild>
                                <Link
                                    href={`/contacts/create?group_id=${group.id}`}
                                >
                                    Thêm liên hệ
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {contacts.data.length > 0 ? (
                            <div className="space-y-4">
                                {contacts.data.map((contact) => (
                                    <Link
                                        key={contact.id}
                                        href={`/contacts/${contact.id}`}
                                        className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                                    >
                                        <Avatar className="h-12 w-12">
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
                                        <div className="flex-1">
                                            <h3 className="font-medium">
                                                {contact.full_name}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                {contact.phone_number && (
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="h-3 w-3" />
                                                        {contact.phone_number}
                                                    </span>
                                                )}
                                                {contact.email && (
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {contact.email}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {contact.is_favorite && (
                                            <Badge
                                                variant="secondary"
                                                className="bg-yellow-100 text-yellow-800"
                                            >
                                                ⭐ Yêu thích
                                            </Badge>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="mb-1 text-lg font-semibold">
                                    Chưa có liên hệ
                                </h3>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Nhóm này chưa có liên hệ nào
                                </p>
                                <Button asChild>
                                    <Link
                                        href={`/contacts/create?group_id=${group.id}`}
                                    >
                                        Thêm liên hệ đầu tiên
                                    </Link>
                                </Button>
                            </div>
                        )}

                        {/* Pagination */}
                        {contacts.data.length > 0 && contacts.last_page > 1 && (
                            <div className="mt-6 flex items-center justify-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        router.get(
                                            `/groups/${group.id}`,
                                            {
                                                page: contacts.current_page - 1,
                                            },
                                            {
                                                preserveState: true,
                                                preserveScroll: true,
                                            },
                                        );
                                    }}
                                    disabled={contacts.current_page === 1}
                                >
                                    ← Trước
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    Trang {contacts.current_page} /{' '}
                                    {contacts.last_page}
                                </span>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        router.get(
                                            `/groups/${group.id}`,
                                            {
                                                page: contacts.current_page + 1,
                                            },
                                            {
                                                preserveState: true,
                                                preserveScroll: true,
                                            },
                                        );
                                    }}
                                    disabled={
                                        contacts.current_page ===
                                        contacts.last_page
                                    }
                                >
                                    Sau →
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa nhóm{' '}
                            <strong>{group.name}</strong>? Nhóm này có{' '}
                            <strong>{group.contacts_count}</strong> liên hệ. Các
                            liên hệ sẽ không bị xóa.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Xóa nhóm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
