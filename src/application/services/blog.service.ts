import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from 'src/domain/entities/blog.entity';
import { Repository } from 'typeorm';
import { CreateBlogDto } from '../DTOs/blog.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}

  async findAll(
    userId: number,
    page: number,
    limit: number,
  ): Promise<{
    blogs: Blog[];
    pagination: { page: number; limit: number; total: number };
  }> {
    try {
      const skip = (page - 1) * limit;
      const [blogs, total] = await this.blogRepository.findAndCount({
        where: { user: { id: userId } },
        order: { updatedAt: 'DESC' },
        skip,
        take: limit,
      });

      return {
        pagination: {
          page,
          limit,
          total,
        },
        blogs,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async findOne(id: number, userId: number): Promise<Blog> {
    try {
      const blog = await this.blogRepository.findOne({
        where: { id, user: { id: userId } },
      });
      if (!blog) {
        throw new UnauthorizedException('You do not have access to this blog');
      }
      return blog;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(createBlogDto: CreateBlogDto, userId: number): Promise<Blog> {
    try {
      const blog = this.blogRepository.create({
        ...createBlogDto,
        user: { id: userId },
      });
      return await this.blogRepository.save(blog);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    id: number,
    updateBlogDto: Partial<CreateBlogDto>,
    userId: number,
  ): Promise<Blog> {
    try {
      const blog = await this.findOne(id, userId);
      if (!blog) {
        throw new UnauthorizedException('You do not have access to this blog');
      }
      await this.blogRepository.update(id, updateBlogDto);
      return await this.blogRepository.findOne({
        where: { id, user: { id: userId } },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number, userId: number): Promise<void> {
    try {
      const blog = await this.findOne(id, userId);
      if (!blog) {
        throw new UnauthorizedException('You do not have access to this blog');
      }

      if (blog.image) {
        const imagePath = path.join(process.cwd(), '', blog.image);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error('Error deleting image file:', err);
          }
        });
      }
      await this.blogRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAllPublished(
    page: number,
    limit: number,
  ): Promise<{
    blogs: Blog[];
    pagination: { page: number; limit: number; total: number };
  }> {
    try {
      const skip = (page - 1) * limit;
      const [blogs, total] = await this.blogRepository
        .createQueryBuilder('blog')
        .leftJoinAndSelect('blog.user', 'user')
        .where('blog.published = :published', { published: true })
        .orderBy('blog.updatedAt', 'DESC')
        .skip(skip)
        .take(limit)
        .select(['blog', 'user.email'])
        .getManyAndCount();

      return {
        pagination: {
          page,
          limit,
          total,
        },
        blogs,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findPublishedById(id: number): Promise<Blog> {
    try {
      const blog = await this.blogRepository
        .createQueryBuilder('blog')
        .leftJoinAndSelect('blog.user', 'user')
        .where('blog.id = :id', { id })
        .andWhere('blog.published = :published', { published: true })
        .select(['blog', 'user.email'])
        .getOne();

      if (!blog) {
        throw new NotFoundException('Blog not found');
      }
      return blog;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findPublishedByUserId(
    userId: number,
    page: number,
    limit: number,
  ): Promise<{
    blogs: Blog[];
    pagination: { page: number; limit: number; total: number };
  }> {
    try {
      const skip = (page - 1) * limit;
      const [blogs, total] = await this.blogRepository
        .createQueryBuilder('blog')
        .leftJoinAndSelect('blog.user', 'user')
        .where('blog.user.id = :userId', { userId })
        .andWhere('blog.published = :published', { published: true })
        .orderBy('blog.updatedAt', 'DESC')
        .skip(skip)
        .take(limit)
        .select(['blog', 'user.email'])
        .getManyAndCount();

      return {
        pagination: {
          page,
          limit,
          total,
        },
        blogs,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async uploadImage(
    blogId: number,
    imageUrl: string,
    userId: number,
  ): Promise<Blog> {
    try {
      const blog = await this.findOne(blogId, userId);
      if (!blog) {
        throw new NotFoundException('Blog not found');
      }
      blog.image = imageUrl;
      return await this.blogRepository.save(blog);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async removeImage(blogId: number, userId: number): Promise<Blog> {
    try {
      const blog = await this.findOne(blogId, userId);
      if (!blog) {
        throw new NotFoundException('Blog not found');
      }

      if (blog.image) {
        const imagePath = path.join(process.cwd(), '', blog.image);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error('Error deleting image file:', err);
          }
        });
      }

      blog.image = null;
      return await this.blogRepository.save(blog);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
