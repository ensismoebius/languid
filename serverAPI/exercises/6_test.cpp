#include <gtest/gtest.h>
#include <fstream>
#include <cstdlib>

TEST(MediaNumerosTest, OutputTest)
{
    system("g++ -o aluno_media aluno_media.cpp");
    system("echo '2.0 4.0 6.0 8.0' | ./aluno_media > saida.txt");
    std::ifstream saida("saida.txt");
    std::string linha;
    std::getline(saida, linha);
    EXPECT_EQ(linha, "Média: 5.0");
}

int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
